#!/usr/bin/env python3
"""voxyd — Voxy background dictation daemon for Linux (Wayland + GNOME).

Flow: press Ctrl+Shift (together) → beep → record from the default mic → press
Ctrl+V to stop → the WAV ships to Groq's whisper-large-v3 under your own API
key → the transcript lands on the clipboard and one synthetic paste drops the
whole thing into wherever your cursor is. Enter finishes too; simulated
typing is the fallback when wl-clipboard is missing.

No server, no account. Your audio goes machine → Groq, nothing else.
"""
from __future__ import annotations

import fcntl
import glob
import json
import math
import os
import select
import shutil
import struct
import subprocess
import sys
import time
import wave
from pathlib import Path

# --------------------------------------------------------------------------
# paths & config
# --------------------------------------------------------------------------
CONFIG_DIR = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config")) / "voxy"
CONFIG_FILE = CONFIG_DIR / "config.json"
CACHE_DIR = Path(os.environ.get("XDG_CACHE_HOME", Path.home() / ".cache")) / "voxy"
LOG_FILE = CACHE_DIR / "voxyd.log"
WAV_FILE = CACHE_DIR / "dictation.wav"

GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
# whisper-large-v3 — Groq's most accurate Whisper (~215x realtime), free tier
# OK: 20 req/min, 28,800 audio-seconds/day ≈ 8 hours of speech daily at no cost.
DEFAULT_MODEL = "whisper-large-v3"

# dictation polish prompt (Groq accepts ≤224 tokens of context). Biases
# whisper-large-v3 toward clean punctuation, casing and spelling.
PROMPT = (
    "Transcribe the user's dictation as polished text: correct grammar, "
    "spelling and punctuation. Capitalize sentences and the words Linux, "
    "Wayland, GNOME, Python, JavaScript, API, GitHub, email. Use apostrophes "
    "in contractions. Spell numbers under ten as words."
)

MAX_RECORD_SECONDS = 120
SAMPLE_RATE = 16000
MIN_AUDIO_BYTES = 4096  # below this the clip is silence/noise; skip the API call

# linux/input-event-codes.h keycodes used for the paste-to-finish chord
KEY_V = 47

TEST_MODE = "--test" in sys.argv

# --------------------------------------------------------------------------
# logging / notifications / audio cues
# --------------------------------------------------------------------------
def log(msg: str) -> None:
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        with LOG_FILE.open("a", encoding="utf-8") as fh:
            fh.write(line + "\n")
    except OSError:
        pass
    print(line, flush=True)


def notify(summary: str, body: str = "", urgent: bool = False) -> None:
    """Desktop notification; never fatal."""
    try:
        subprocess.Popen(
            [
                "notify-send",
                "-a", "Voxy",
                "-u", "critical" if urgent else "normal",
                "-t", "2600",
                "--icon", "audio-input-microphone",
                summary, body,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except OSError:
        pass


def beep(kind: str) -> None:
    """Short start/stop/error cues so you know when recording is live."""
    spec = {"start": (1200, 0.09), "stop": (880, 0.12), "error": (320, 0.18)}.get(kind)
    if not spec:
        return
    try:
        freq, dur = spec
        rate = 48000
        path = CACHE_DIR / f"beep-{kind}.wav"
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        with wave.open(str(path), "w") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(rate)
            n = int(rate * dur)
            frames = bytearray()
            for i in range(n):
                # fade in/out so the tone doesn't click
                env = min(1.0, i / (rate * 0.012), (n - i) / (rate * 0.012))
                frames += struct.pack("<h", int(9000 * env * math.sin(2 * math.pi * freq * i / rate)))
            w.writeframes(bytes(frames))
        subprocess.Popen(
            ["paplay", str(path)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception as exc:  # beeps are cosmetic
        log(f"beep({kind}) failed: {exc}")


# --------------------------------------------------------------------------
# config: groq api key, trigger key, model override
# --------------------------------------------------------------------------
def load_config() -> dict:
    try:
        return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def load_key(cfg: dict) -> str | None:
    """API key precedence: VOXY_GROQ_KEY env → config file."""
    env = os.environ.get("VOXY_GROQ_KEY", "").strip()
    if env:
        return env
    key = str(cfg.get("groq_api_key", ""))
    return key.strip() or None


def ensure_config_template() -> None:
    """First run: leave an empty config so the user only has to paste a key."""
    if CONFIG_FILE.exists():
        return
    try:
        CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        CONFIG_FILE.write_text(
            json.dumps(
                {"groq_api_key": "", "trigger": "ctrlshift", "model": DEFAULT_MODEL},
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        os.chmod(CONFIG_FILE, 0o600)
        log(f"wrote {CONFIG_FILE} — paste your free Groq key into groq_api_key")
    except OSError as exc:
        log(f"could not write config template: {exc}")


# --------------------------------------------------------------------------
# audio capture (PipeWire via pw-record)
# --------------------------------------------------------------------------
RECORDING: dict = {"proc": None}


def start_recording() -> None:
    """Spawn pw-record on the default mic; the handle lives in RECORDING.

    pw-record (unlike parecord) flushes a valid WAV header+data on SIGTERM.
    """
    WAV_FILE.unlink(missing_ok=True)
    RECORDING["proc"] = subprocess.Popen(
        [
            "pw-record",
            "--rate", str(SAMPLE_RATE),
            "--channels", "1",
            "--format", "s16",
            str(WAV_FILE),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    clipboard_clear()  # the user's stop-chord Ctrl+V must paste nothing
    beep("start")
    log("recording… (Ctrl+V to finish and paste, Enter or Ctrl+Shift also stop)")


def stop_recording() -> None:
    proc = RECORDING.get("proc")
    if proc is None:
        return
    RECORDING["proc"] = None
    proc.terminate()
    try:
        proc.wait(timeout=2)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.wait()
    beep("stop")


# --------------------------------------------------------------------------
# transcription (Groq)
# --------------------------------------------------------------------------
def transcribe(wav: Path, api_key: str, model: str) -> str:
    """Ship the WAV to Groq, return the polished transcript."""
    size = wav.stat().st_size
    if size < MIN_AUDIO_BYTES:
        raise RuntimeError(f"clip too small to be speech ({size} bytes)")

    curl = subprocess.run(
        [
            "curl", "-sS", "--fail-with-body", "--max-time", "60",
            "-X", "POST", GROQ_URL,
            "-H", f"Authorization: Bearer {api_key}",
            "-F", f"file=@{wav};type=audio/wav",
            "-F", f"model={model}",
            "-F", f"prompt={PROMPT}",
            "-F", "temperature=0",
            "-F", "response_format=json",
        ],
        capture_output=True,
        text=True,
        timeout=70,
    )
    if curl.returncode != 0:
        raise RuntimeError(f"groq request failed: {curl.stderr.strip() or curl.stdout.strip()}")
    try:
        body = json.loads(curl.stdout)
    except ValueError as exc:
        raise RuntimeError(f"groq returned non-JSON: {curl.stdout[:200]}") from exc
    if "error" in body:
        raise RuntimeError(f"groq error: {body['error'].get('message', body['error'])}")
    text = str(body.get("text", "")).strip()
    if not text:
        raise RuntimeError("groq returned an empty transcript")
    return text


# --------------------------------------------------------------------------
# text injection (Wayland)
# --------------------------------------------------------------------------
# Preferred path: the transcript rides the Wayland clipboard and one synthetic
# Ctrl+Shift+V drops it in whole — instant, layout-proof, no per-key delays,
# and it's the paste chord that works in BOTH GUI apps and terminals (plain
# Ctrl+V is quoted-insert in terminals: it swallowed our synthetic V and typed
# a literal 'v' instead). The user's own Ctrl+V (or Ctrl+Shift+V in terminals)
# is what stops the recording, so the clipboard is pre-emptively cleared when
# recording starts: the app receives that same Ctrl+V and pastes nothing.
# Fallback: ydotool typing.
YDOTOOL_SOCKET = f"/run/user/{os.getuid()}/.ydotool_socket"

# Wayland seats expose selection state through a socket in XDG_RUNTIME_DIR.
def wayland_display() -> str:
    """The compositor's Wayland socket name, for wl-clipboard's env."""
    env_disp = os.environ.get("WAYLAND_DISPLAY", "")
    if env_disp:
        return env_disp
    # systemd user services usually get WAYLAND_DISPLAY injected by GNOME;
    # fall back to the conventional socket names
    for cand in ("wayland-0", "wayland-1"):
        if (Path("/run/user") / str(os.getuid())).joinpath(cand).exists():
            return cand
    return "wayland-0"


def clipboard_env() -> dict[str, str]:
    """wl-clipboard needs WAYLAND_DISPLAY; the systemd user manager usually
    carries it, but be explicit so the daemon works regardless."""
    env = dict(os.environ)
    env.setdefault("WAYLAND_DISPLAY", wayland_display())
    env.setdefault("XDG_RUNTIME_DIR", f"/run/user/{os.getuid()}")
    return env


def clipboard_clear() -> None:
    """Empty the clipboard so the user's stop-chord Ctrl+V pastes nothing."""
    try:
        subprocess.run(
            ["wl-copy", "--clear"],
            env=clipboard_env(),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=5,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired):
        pass


def clipboard_set(text: str) -> bool:
    """Put text on the clipboard. Returns False when wl-clipboard is absent."""
    if not shutil.which("wl-copy"):
        return False
    try:
        subprocess.run(
            ["wl-copy", "--", text],
            env=clipboard_env(),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=10,
            check=True,
        )
        return True
    except (OSError, subprocess.SubprocessError):
        return False


def paste_keys() -> None:
    """Synthesize Ctrl+Shift+V — the paste chord that works everywhere.

    Plain Ctrl+V is a trap: in terminals it's readline's quoted-insert, which
    swallows the next keystroke literally (that's where the stray 'v' came
    from). Ctrl+Shift+V pastes in GTK, Chromium, Firefox, VS Code and every
    terminal — and since transcripts are plain text, "paste as plain text"
    costs nothing.

    The modifier events need breathing room: Electron apps (VS Code) are
    known to drop uinput modifier chords sent with zero delay — the app
    processes the V keypress before ctrl/shift state is registered and types
    a bare 'v' (ydotool issue #71). --key-delay 50 paces every event.
    """
    env = dict(os.environ)
    if Path(YDOTOOL_SOCKET).exists():
        env["YDOTOOL_SOCKET"] = YDOTOOL_SOCKET
    # ctrl(29) shift(42) v(47): mods down → V tap → mods up, paced so the
    # modifier state is live before V lands
    chord = [
        (29, 1), (42, 1), (47, 1),  # ctrl↓ shift↓ v↓
        (47, 0),                     # v↑ (release V while mods still held)
        (42, 0), (29, 0),            # shift↑ ctrl↑
    ]
    try:
        subprocess.run(
            ["ydotool", "key", "--key-delay", "50",
             *[f"{c}:{d}" for c, d in chord]],
            check=True,
            timeout=10,
            env=env,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except (OSError, subprocess.SubprocessError):
        # synthetic paste didn't land — fall back to typing so the user still
        # gets their text rather than a dead clipboard
        pass



def type_text(text: str) -> None:
    """Type the transcript into the focused field via ydotoold's virtual device.

    Kept as an explicit escape hatch ("insert": "type" in the config) for apps
    that eat synthetic paste chords; 2ms/char keeps it near-instant.
    """
    env = dict(os.environ)
    if Path(YDOTOOL_SOCKET).exists():
        env["YDOTOOL_SOCKET"] = YDOTOOL_SOCKET
    subprocess.run(
        ["ydotool", "type", "--key-delay=2", "--key-hold=4", "--", text],
        check=True,
        timeout=120,
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def insert_text(text: str, insert_mode: str) -> None:
    """Deliver the transcript the way cfg["insert"] asks: paste (default,
    via clipboard + synthetic chord) or type (per-character)."""
    if insert_mode == "type":
        type_text(text)
        return
    if clipboard_set(text):
        paste_keys()
    else:
        type_text(text)


# --------------------------------------------------------------------------
# hotkey listener (/dev/input EV_KEY reader — needs the `input` group)
# --------------------------------------------------------------------------
# linux/input-event-codes.h
EV_KEY = 0x01
KEY_FN = 464
KEY_ENTER = 28
KEY_CAPSLOCK = 58
KEY_SCROLLLOCK = 70
KEY_RIGHTCTRL = 97
KEY_LEFTCTRL = 29
KEY_LEFTSHIFT = 42
KEY_RIGHTSHIFT = 54

# event values
VAL_DOWN, VAL_UP, VAL_REPEAT = 1, 0, 2

# each trigger is a SET of keycodes that must be held together; any member
# release ends the gesture. ctrl/shift match either hand's key.
_CTRL = (KEY_LEFTCTRL, KEY_RIGHTCTRL)
_SHIFT = (KEY_LEFTSHIFT, KEY_RIGHTSHIFT)
TRIGGERS: dict[str, frozenset[int]] = {
    "ctrlshift": frozenset({KEY_LEFTCTRL, KEY_LEFTSHIFT}),
    "fn": frozenset({KEY_FN}),
    "rightctrl": frozenset({KEY_RIGHTCTRL}),
    "scrolllock": frozenset({KEY_SCROLLLOCK}),
    "capslock": frozenset({KEY_CAPSLOCK}),
}

# the paste-to-finish chord: the user's plain Ctrl+V works in GUI apps; in
# terminals it's quoted-insert (swallows the next key), so Ctrl+Shift+V must
# also be accepted as a stop signal there. Either hand's ctrl/shift counts.
_PASTE_MODS = {KEY_LEFTCTRL, KEY_RIGHTCTRL, KEY_LEFTSHIFT, KEY_RIGHTSHIFT}


def _paste_mods_ok(held: set[int], trigger: frozenset[int]) -> bool:
    """True when the mods held around a V press look like a paste chord:
    ctrl (optionally + shift) and nothing else beyond them and V itself."""
    mods = held & _PASTE_MODS
    if not (KEY_LEFTCTRL in mods or KEY_RIGHTCTRL in mods):
        return False
    return held - mods <= {KEY_V}


def _paste_keys_held(held: set[int], trigger: frozenset[int]) -> bool:
    """True when the held set is exactly ctrl(+shift) plus V — i.e. this looks
    like the user's paste keystroke and nothing else contaminates it.

    With the ctrlshift trigger, Ctrl+Shift+V is also the plain "stop" chord
    (both members held) — on_paste and on_trigger do the same thing then, so
    either firing is fine; we keep the trigger path and don't double-fire."""
    if not _paste_mods_ok(held, trigger):
        return False
    return not (trigger <= held) or trigger != frozenset(
        {KEY_LEFTCTRL, KEY_LEFTSHIFT}
    )


def iocr(nr: int, size: int) -> int:
    """EVIOCGBIT/EVIOCGNAME ioctl request builder (_IOC(IOC_READ, 'E', nr, size))."""
    return 0x80000000 | (size << 16) | (0x45 << 8) | nr


EVIOCGBIT_KEY = iocr(0x21, 96)
EVIOCGNAME = iocr(0x06, 256)

DEV: tuple[str, bool] = ("", False)  # (device path, does it advertise KEY_FN)


def pick_keyboard() -> tuple[str, bool]:
    """Return (device path, does it advertise KEY_FN).

    Skips virtual devices (ydotoold) — we must see the *user's* keys.
    TEST_MODE accepts the virtual device too: synthetic ydotool events land
    there, which is how the trigger loop is verified end-to-end.
    """
    candidates: list[tuple[str, str, bool, bool]] = []  # path, name, has_fn, is_virtual
    for path in sorted(glob.glob("/dev/input/event*")):
        try:
            fd = os.open(path, os.O_RDONLY | os.O_NONBLOCK)
        except OSError:
            continue
        try:
            buf = bytearray(256)
            fcntl.ioctl(fd, EVIOCGNAME, buf, True)
            name = buf.split(b"\x00")[0].decode(errors="replace").lower()
            bits = bytearray(96)
            fcntl.ioctl(fd, EVIOCGBIT_KEY, bits, True)
            keys = {i for i in range(768) if bits[i // 8] >> (i % 8) & 1}
            candidates.append((path, name, KEY_FN in keys, "virtual" in name or "ydotoold" in name))
        except OSError:
            continue
        finally:
            os.close(fd)

    if TEST_MODE:
        # newest node first: a freshly created test injector must win over
        # the stale ydotoold virtual device
        for path, _name, has_fn, _v in sorted(
            candidates, key=lambda c: int(c[0].split("event")[1]), reverse=True
        ):
            if has_fn:
                return path, True
        raise RuntimeError("--test: no device advertising KEY_FN found")

    real = [(p, n, f) for p, n, f, v in candidates if not v]
    for path, _name, has_fn in real:
        if has_fn:
            return path, True
    # Fn is firmware-swallowed on most laptops; pick a real keyboard anyway —
    # main() falls back to a visible trigger key.
    for path, name, _has_fn in real:
        if "keyboard" in name or "translated" in name:
            return path, False
    if real:
        return real[0][0], False
    raise RuntimeError("no readable /dev/input keyboard found (are you in the `input` group?)")


def run_listener(trigger: frozenset[int], on_trigger, on_enter, on_paste) -> None:
    """Read EV_KEY events; fire on_trigger when the trigger chord is pressed
    together (e.g. Ctrl+Shift), on_enter when Enter is pressed, on_paste when
    Ctrl+V / Ctrl+Shift+V lands while recording (the user's stop-and-insert).
    `select` keeps the idle loop cheap."""
    fd = os.open(DEV[0], os.O_RDONLY | os.O_NONBLOCK)
    log(f"listening on {DEV[0]}")
    held: set[int] = set()
    chord_armed = False    # chord fully held and nothing else pressed since
    chord_fired = False    # on_trigger already ran for this chord hold
    paste_armed = False    # ctrl(+shift) held and V armed — the paste chord
    try:
        while True:
            r, _, _ = select.select([fd], [], [], 0.5)
            if not r:
                continue
            # one read can carry several input_events (24 bytes each on 64-bit)
            try:
                data = os.read(fd, 192)
            except OSError:
                log("input device went away — exiting")
                notify("Voxy stopped", "Input device disappeared; restart voxyd", urgent=True)
                return
            for off in range(0, len(data) - 23, 24):
                # "<qqHHi": timeval = two 8-byte longs on 64-bit ("L" would be
                # Python's 4-byte standard size — the classic 24-byte trap)
                _sec, _usec, etype, ecode, evalue = struct.unpack_from("<qqHHi", data, off)
                if etype != EV_KEY:
                    continue
                if evalue == VAL_DOWN:
                    held.add(ecode)
                    if ecode in trigger:
                        # every chord member down? then the chord is armed —
                        # and if we were already recording, this press ends it
                        if trigger <= held:
                            if chord_fired:
                                on_trigger()  # second chord while recording = stop
                                chord_fired = False
                            else:
                                chord_armed = True
                    elif ecode == KEY_V and _paste_mods_ok(held, trigger):
                        paste_armed = True  # ctrl(+shift) was already down
                    elif ecode not in _PASTE_MODS:
                        chord_armed = False  # extra key = some other shortcut
                        paste_armed = False
                elif evalue == VAL_UP:
                    was = ecode in held
                    held.discard(ecode)
                    if ecode in trigger:
                        if chord_armed and was:
                            on_trigger()          # chord pressed together → go
                            chord_fired = True
                        chord_armed = False
                    elif was:
                        chord_armed = False
                        if ecode in _PASTE_MODS:
                            paste_armed = False
                elif evalue == VAL_REPEAT:
                    chord_armed = False
                    paste_armed = False
                # fire paste-to-finish on the V *release* — by then the app has
                # already pasted (the empty clipboard), so our synthetic paste
                # later can't race the user's keystroke
                if ecode == KEY_V and evalue == VAL_UP and paste_armed:
                    paste_armed = False
                    if RECORDING["proc"] is not None:
                        on_paste()
                if ecode == KEY_ENTER and evalue == VAL_DOWN and not (trigger <= held):
                    on_enter()
    finally:
        os.close(fd)


# --------------------------------------------------------------------------
# actions
# --------------------------------------------------------------------------
def transcribe_and_type() -> None:
    cfg = load_config()
    api_key = load_key(cfg)
    if not api_key:
        beep("error")
        log("no Groq API key — paste it into ~/.config/voxy/config.json (groq_api_key)")
        notify(
            "Voxy needs your API key",
            "Put your free Groq key in ~/.config/voxy/config.json",
            urgent=True,
        )
        return
    model = str(cfg.get("model") or DEFAULT_MODEL)
    insert_mode = str(cfg.get("insert") or "paste")
    try:
        text = transcribe(WAV_FILE, api_key, model)
        log(f"transcript: {text[:90]}{'…' if len(text) > 90 else ''}")
        insert_text(text, insert_mode)
    except Exception as exc:
        beep("error")
        log(f"FAILED: {exc}")
        notify("Voxy failed", str(exc)[:160], urgent=True)


def on_trigger() -> None:
    """Chord press: toggle recording."""
    if RECORDING["proc"] is None:
        start_recording()
    else:
        stop_recording()
        transcribe_and_type()


def on_paste() -> None:
    """The user pressed Ctrl+V (or Ctrl+Shift+V) while recording: their paste
    already hit the app with an empty clipboard — now transcribe and paste."""
    was_recording = RECORDING["proc"] is not None
    if was_recording:
        stop_recording()
        transcribe_and_type()


def on_enter() -> None:
    if RECORDING["proc"] is not None:
        stop_recording()
        transcribe_and_type()


def resolve_trigger(cfg: dict) -> frozenset[int]:
    """Return the chord for cfg["trigger"].

    Fn alone is firmware-swallowed on most laptops (the kernel never sees a
    lone Fn press), so any Fn request falls back to Ctrl+Shift — which, unlike
    Right Ctrl, doesn't collide with everyday shortcuts like Ctrl+C/Ctrl+V.
    """
    name = str(cfg.get("trigger", "ctrlshift")).lower()
    chord = TRIGGERS.get(name, TRIGGERS["ctrlshift"])
    if chord == TRIGGERS["fn"] and not DEV[1]:
        log("this keyboard never reports the Fn key to Linux (the firmware swallows it)")
        log("using CTRL+SHIFT as the dictation chord instead")
        notify("Voxy: Fn isn't visible to Linux", "Using Ctrl+Shift as the dictation key instead", urgent=True)
        return TRIGGERS["ctrlshift"]
    return chord


def main() -> None:
    try:
        if not TEST_MODE:
            ensure_config_template()
        global DEV
        DEV = pick_keyboard()
        chord = resolve_trigger(load_config())
        label = "+".join(
            {29: "Ctrl", 42: "Shift", 97: "RightCtrl", 58: "CapsLock",
             70: "ScrollLock", 464: "Fn"}.get(c, str(c)) for c in sorted(chord)
        )
        log(f"voxyd ready — press {label} to dictate, Ctrl+V to finish")
        run_listener(chord, on_trigger, on_enter, on_paste)
    except KeyboardInterrupt:
        log("bye")
    except RuntimeError as exc:
        notify("Voxy failed to start", str(exc), urgent=True)
        log(f"FATAL: {exc}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
