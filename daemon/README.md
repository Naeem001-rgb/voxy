# voxyd — Voxy's backend daemon

Background dictation for Linux (Wayland + GNOME): press **Ctrl+Shift** →
speak → press **Ctrl+V** → polished transcript pasted whole into whatever text
field has focus. (Enter or Ctrl+Shift also finish; Ctrl+Shift+V works in
terminals.) Audio goes machine → Groq (`whisper-large-v3`, the most accurate
Whisper) under **your own free API key**. No server of ours touches it.

## Install (one command, every distro)

```bash
bash install.sh
```

That's it. The installer detects your distro (Fedora/Debian/Arch/openSUSE —
anything with dnf, apt, pacman or zypper), installs what's missing, **asks for
your Groq API key right in the terminal** (hidden input, validated against
Groq before it continues), writes the config, and registers the background
service. You never open an editor or touch a config file.

Requires `wl-clipboard` (the instant paste) — the installer picks it up with
the other packages; on dnf it's `wl-clipboard`, apt `wl-clipboard`, pacman
`wl-clipboard`, zypper `wl-clipboard`.

Non-interactive / scripting:

```bash
bash install.sh --key gsk_…   # key via flag (CI, dotfiles)
bash install.sh uninstall     # clean removal
```

Manual route (no installer):

1. Get a free key at <https://console.groq.com/keys> and paste it in:

   ```bash
   # first run of the daemon creates this file if it doesn't exist
   python3 -c "import json,pathlib; p=pathlib.Path.home()/'.config/voxy/config.json'; \
     c=json.loads(p.read_text()) if p.exists() else {'trigger':'ctrlshift','model':'whisper-large-v3'}; \
     c['groq_api_key']='gsk_YOUR_KEY_HERE'; p.parent.mkdir(parents=True, exist_ok=True); \
     p.write_text(json.dumps(c, indent=2))"
   chmod 600 ~/.config/voxy/config.json
   ```

2. Run it:

   ```bash
   cd voxyd
   python3 voxyd.py          # foreground; Ctrl-C to quit
   ```

3. Or install it with one command (already done on this machine):

   ```bash
   cp voxyd.service ~/.config/systemd/user/ && systemctl --user daemon-reload && systemctl --user enable --now voxyd
   ```


## Using it

- **Press Ctrl+Shift** (both together) → beep, recording starts (clipboard is cleared).
- **Press Ctrl+V** → beep, the transcript is pasted whole at your cursor. Instant.
  - In terminals use **Ctrl+Shift+V** (their paste convention) — same effect.
  - **Enter** or **Ctrl+Shift** again also stop and insert.
- Free-tier budget: 28,800 audio-seconds/day ≈ 8 hours of speech, 20 requests/min.
- Heads-up: dictation replaces your clipboard contents (it's how the instant
  paste works).
- Config at `~/.config/voxy/config.json`:
  - `groq_api_key` — your key
  - `trigger` — `ctrlshift` (default) | `fn` | `rightctrl` | `scrolllock` | `capslock`
  - `model` — default `whisper-large-v3`; use `whisper-large-v3-turbo` for a cheaper/faster (slightly less accurate) run
  - `insert` — `paste` (default: clipboard + paced Ctrl+Shift+V) | `type` (per-character typing, for apps that eat synthetic paste chords)

### About the Fn key

Most laptop firmware swallows Fn **alone** — the kernel never sees it, so no
daemon can. That's why the default is **Ctrl+Shift**: both keys are visible to
Linux, the chord doesn't collide with normal shortcuts (Ctrl+C, Ctrl+V, etc.),
and the trigger only fires when they're pressed together, never when either is
used with other keys.

## Testing without dictating

```bash
python3 voxyctl.py 5        # record 5s from the mic, transcribe, print
python3 voxyctl.py file x.wav
```

## Files

| Path | Purpose |
|---|---|
| `~/.config/voxy/config.json` | API key, trigger key, model |
| `~/.cache/voxy/dictation.wav` | last recording (overwritten each time) |
| `~/.cache/voxy/voxyd.log` | log |

## Requirements

- Python 3.10+, PipeWire (`pw-record`), `paplay`, `notify-send`, `curl`, `ydotool` + `ydotoold`
- Membership in the `input` group (`sudo usermod -aG input $USER`, re-login)

The daemon reads `/dev/input/event*` for the hotkey, records via PipeWire,
POSTs the WAV to Groq, and types the result with ydotool (uinput), which works
under Wayland in any focused text field.
