#!/usr/bin/env python3
"""voxyctl — one-shot test client for voxyd's transcription path.

Records a fixed-length clip from the default mic and runs it through the
exact same transcribe() the daemon uses. Two modes:

  voxyctl record 5     record 5 seconds from the mic, transcribe, print text
  voxyctl file X.wav   transcribe an existing WAV
"""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from voxyd import (  # noqa: E402
    DEFAULT_MODEL,
    SAMPLE_RATE,
    load_config,
    load_key,
    transcribe,
)


def main() -> None:
    cfg = load_config()
    key = load_key(cfg)
    if not key:
        print("no Groq API key — paste it into ~/.config/voxy/config.json (groq_api_key)")
        raise SystemExit(1)
    model = str(cfg.get("model") or DEFAULT_MODEL)

    if len(sys.argv) >= 3 and sys.argv[1] == "file":
        wav = Path(sys.argv[2])
        if not wav.exists():
            print(f"{wav} not found")
            raise SystemExit(1)
    else:
        seconds = float(sys.argv[1]) if len(sys.argv) > 1 else 5.0
        wav = Path("/tmp/voxyctl-clip.wav")
        wav.unlink(missing_ok=True)
        print(f"recording {seconds}s from default mic ({SAMPLE_RATE} Hz mono)… speak now")
        proc = subprocess.Popen(
            [
                "pw-record",
                "--rate", str(SAMPLE_RATE),
                "--channels", "1",
                "--format", "s16",
                str(wav),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        time.sleep(seconds)
        proc.terminate()
        proc.wait(timeout=5)
        print(f"captured {wav.stat().st_size} bytes → calling Groq {model}…")

    t0 = time.monotonic()
    try:
        text = transcribe(wav, key, model)
    except Exception as exc:
        print(f"FAILED: {exc}")
        raise SystemExit(1)
    dt = time.monotonic() - t0
    print(f"--- transcript ({dt:.2f}s round trip) ---")
    print(text)


if __name__ == "__main__":
    main()
