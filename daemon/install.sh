#!/usr/bin/env bash
# voxyd installer — one command for every distro.
#
#   bash install.sh              install + ask for the Groq API key + start
#   bash install.sh --key gsk_…  non-interactive (key via flag, for CI)
#   bash install.sh uninstall    remove voxyd completely
#
# Detects the package manager (dnf/apt/pacman/zypper), installs everything
# voxyd needs, asks for the API key in the terminal (hidden input), validates
# it against Groq, writes the config, and registers the systemd user service.
# The user never opens an editor.
set -euo pipefail

# ---------------------------------------------------------------- presentation
if [ -t 1 ]; then
  B=$'\033[1m'; G=$'\033[32m'; Y=$'\033[33m'; R=$'\033[31m'; D=$'\033[2m'; N=$'\033[0m'
else
  B=""; G=""; Y=""; R=""; D=""; N=""
fi
# read one line: prefer /dev/tty (works when piped via curl|bash), fall back to stdin
read_line() {  # read_line [-s] PROMPT -> REPLY
  local silent=""
  [ "${1:-}" = "-s" ] && { silent="-s"; shift; }
  # /dev/tty can exist yet be unopenable (no controlling terminal) — probe with a real open
  if { exec 9<>/dev/tty; } 2>/dev/null; then
    read $silent -r -u 9 -p "$1" REPLY || REPLY=""
    exec 9<&- 9>&-
  else
    read $silent -r -p "$1" REPLY || REPLY=""
  fi
}

say()  { printf '%s\n' "${G}==>${N} $*"; }
warn() { printf '%s\n' "${Y}warning:${N} $*"; }
die()  { printf '%s\n' "${R}error:${N} $*" >&2; exit 1; }

[ "$(id -u)" = 0 ] && die "run this as your normal user — sudo is used internally only for package installs"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/voxy"
CONFIG_FILE="$CONFIG_DIR/config.json"
SYSTEMD_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
UNIT_FILE="$SYSTEMD_DIR/voxyd.service"

KEY_FLAG=""   # --key value (CI/testing convenience)
for arg in "$@"; do
  case "$arg" in
    uninstall) UNINSTALL=1 ;;
    --key) KEY_FLAG="__next__" ;;
    __next__) true ;;
    --*) die "unknown option: $arg" ;;
    *) if [ "$KEY_FLAG" = "__next__" ]; then KEY_FLAG="$arg"; else die "unknown argument: $arg"; fi ;;
  esac
done
KEY_FLAG="${KEY_FLAG:-}"

# ------------------------------------------------------------------- uninstall
if [ "${UNINSTALL:-0}" = 1 ]; then
  say "stopping and removing voxyd…"
  systemctl --user disable --now voxyd.service 2>/dev/null || true
  rm -f "$UNIT_FILE"
  systemctl --user daemon-reload
  [ -f "$CONFIG_FILE" ] && warn "your config (with the API key) is still at $CONFIG_FILE — delete it manually if you want"
  say "${B}voxyd removed.${N}"
  exit 0
fi

[ -f "$SCRIPT_DIR/voxyd.py" ] || die "voxyd.py not found next to install.sh"

# ------------------------------------------------------------- sudo / packages
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  command -v sudo >/dev/null 2>&1 || die "sudo is required to install packages"
  SUDO="sudo"
fi

missing() { command -v "$1" >/dev/null 2>&1; }

# binary → package name, per package manager
PKGS=()
choose_pkgs() {
  local mgr
  mgr="$1"
  local pw pa ny cu wc
  case "$mgr" in
    dnf)    pw="pipewire-utils";   pa="pipewire-utils";   ny="libnotify";       cu="curl"; wc="wl-clipboard" ;;
    apt)    pw="pipewire-bin";     pa="pulseaudio-utils"; ny="libnotify-bin";   cu="curl"; wc="wl-clipboard" ;;
    pacman) pw="pipewire-audio";   pa="pipewire-audio";   ny="libnotify";       cu="curl"; wc="wl-clipboard" ;;
    zypper) pw="pipewire";         pa="pulseaudio-utils"; ny="libnotify-tools"; cu="curl"; wc="wl-clipboard" ;;
  esac
  missing pw-record   || true; missing pw-record   && PKGS+=("$pw")
  missing paplay      && PKGS+=("$pa")
  missing notify-send && PKGS+=("$ny")
  missing curl        && PKGS+=("$cu")
  missing wl-copy     && PKGS+=("$wc")
  missing ydotool     && PKGS+=("ydotool")
}

if missing pw-record && missing paplay && missing notify-send && missing curl && missing wl-copy && missing ydotool; then
  say "all dependencies already present"
else
  if [ -z "$MGR" ]; then
    warn "unknown package manager — install these if missing: pw-record (PipeWire), paplay, notify-send, curl, wl-clipboard, ydotool"
  else
    choose_pkgs "$MGR"
    if [ "${#PKGS[@]}" -gt 0 ]; then
      say "installing missing packages via $MGR: ${B}${PKGS[*]}${N}"
      case "$MGR" in
        dnf)    $SUDO dnf install -y -q "${PKGS[@]}" || warn "dnf install had problems — check output above" ;;
        apt)    $SUDO apt-get update -qq || true; $SUDO apt-get install -y -q "${PKGS[@]}" || warn "apt install had problems — check output above" ;;
        pacman) $SUDO pacman -S --needed --noconfirm --quiet "${PKGS[@]}" || warn "pacman install had problems — check output above" ;;
        zypper) $SUDO zypper --non-interactive install -q "${PKGS[@]}" || warn "zypper install had problems — check output above" ;;
      esac
    fi
  fi
fi

if command -v dnf >/dev/null 2>&1; then MGR=dnf
elif command -v apt-get >/dev/null 2>&1; then MGR=apt
elif command -v pacman >/dev/null 2>&1; then MGR=pacman
elif command -v zypper >/dev/null 2>&1; then MGR=zypper
else MGR=""
fi

# final dependency check
DEP_MISSING=0
for bin in python3 pw-record paplay notify-send curl wl-copy ydotool; do
  if ! missing "$bin"; then
    warn "still missing: $bin — install it manually, dictation may not work without it"
    DEP_MISSING=1
  fi
done
[ "$DEP_MISSING" = 0 ] && say "dependencies OK"

# ------------------------------------------------------------------ input group
NEED_RELOGIN=0
if id -nG "$USER" | tr ' ' '\n' | grep -qx input; then
  say "input group membership OK"
else
  say "adding $USER to the input group (lets voxyd watch the keyboard)"
  getent group input >/dev/null 2>&1 || $SUDO groupadd input
  $SUDO usermod -aG input "$USER"
  NEED_RELOGIN=1
fi

# ------------------------------------------------------------------- API key
validate_key() {
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 \
    -H "Authorization: Bearer $1" https://api.groq.com/openai/v1/models) || return 2
  [ "$code" = "200" ] || return 1
}

EXISTING_KEY=""
if [ -f "$CONFIG_FILE" ]; then
  EXISTING_KEY="$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1])).get("groq_api_key",""))' "$CONFIG_FILE" 2>/dev/null || true)"
fi

API_KEY=""
if [ -n "$KEY_FLAG" ]; then
  API_KEY="$KEY_FLAG"
elif [ -n "$EXISTING_KEY" ]; then
  printf '%s' "${D}an API key is already configured.${N} "
  read_line "Keep it? [Y/n]: " || ans=""
  ans="${REPLY:-Y}"
  case "$ans" in n*|N*)
    [ -t 0 ] || die "need a TTY to prompt for a new key — rerun with --key gsk_…"
    printf '%s\n' "${G}==>${N} paste your free Groq key (${D}https://console.groq.com/keys${N})"
    while :; do
      read_line -s "API key: "; API_KEY="${REPLY:-}"; printf '%s\n' ""
      [ -n "$API_KEY" ] && break
      printf '%s\n' "${Y}the key can't be empty${N}"
    done
  ;; esac
else
  printf '%s\n' "${B}Voxy needs a free Groq API key to run dictation.${N}"
  printf '%s\n' "${D}create one at https://console.groq.com/keys (takes a minute, no card needed)${N}"
  if [ -t 0 ]; then
    while :; do
      read_line -s "paste API key (input hidden, Enter to skip for now): "; API_KEY="${REPLY:-}"; printf '%s\n' ""
      [ -z "$API_KEY" ] && { warn "skipped — you can rerun this installer later to add the key"; break; }
      break
    done
  else
    warn "no terminal for the key prompt — rerun 'bash install.sh' from a terminal, or use --key gsk_…"
  fi
fi

if [ -n "$API_KEY" ]; then
  say "checking the key against Groq…"
  tries=0
  while :; do
    if validate_key "$API_KEY"; then
      say "${G}key works${N}"
      break
    elif [ $? = 2 ]; then
      warn "couldn't reach api.groq.com — keeping the key anyway, dictation will tell you if it's wrong"
      break
    fi
    tries=$((tries + 1))
    [ "$tries" -ge 3 ] && die "key rejected by Groq after 3 tries — get a fresh one at https://console.groq.com/keys"
    printf '%s\n' "${R}that key was rejected (HTTP error). try pasting it again:${N}"
    read_line -s "API key: "; API_KEY="${REPLY:-}"; printf '%s\n' ""
    [ -n "$API_KEY" ] || die "empty key — rerun with --key gsk_…"
  done
else
  API_KEY="$EXISTING_KEY"
fi

# ------------------------------------------------------------------- write config
say "writing $CONFIG_FILE"
python3 - "$CONFIG_FILE" "$API_KEY" <<'PYEOF'
import json, os, sys
path, key = sys.argv[1], sys.argv[2]
try:
    cfg = json.load(open(path))
except Exception:
    cfg = {}
cfg.update({"groq_api_key": key, "trigger": "ctrlshift", "model": "whisper-large-v3"})
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w") as fh:
    json.dump(cfg, fh, indent=2)
    fh.write("\n")
os.chmod(path, 0o600)
PYEOF

# ------------------------------------------------------------------- ydotoold
say "ensuring ydotoold (virtual keyboard for typing the transcript)"
if systemctl --user cat ydotoold.service >/dev/null 2>&1; then
  systemctl --user enable --now ydotoold.service 2>/dev/null || true
elif systemctl cat ydotoold.service >/dev/null 2>&1; then
  $SUDO systemctl enable --now ydotoold.service 2>/dev/null || true
fi
if pgrep -x ydotoold >/dev/null 2>&1; then
  say "ydotoold is running"
else
  warn "ydotoold isn't running — text typing may not work; 'systemctl --user enable --now ydotoold' after installing ydotool"
fi

# ------------------------------------------------------------------- service
say "installing the voxyd background service"
PY3="$(command -v python3)"
mkdir -p "$SYSTEMD_DIR"
cat > "$UNIT_FILE" <<UNIT
[Unit]
Description=Voxy dictation daemon (Ctrl+Shift -> Groq Whisper -> paste)
After=pipewire.service wireplumber.service
StartLimitIntervalSec=0

[Service]
ExecStart=$PY3 $SCRIPT_DIR/voxyd.py
WorkingDirectory=$SCRIPT_DIR
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
UNIT
systemctl --user daemon-reload
systemctl --user enable --now voxyd.service
sleep 2

# ------------------------------------------------------------------- done
printf '%s\n' ""
if systemctl --user is-active --quiet voxyd.service; then
  say "${B}${G}voxyd is running.${N} Status anytime: ${D}systemctl --user status voxyd${N}"
else
  warn "service installed but not running yet — check ${D}journalctl --user -u voxyd${N}"
fi
if [ "$NEED_RELOGIN" = 1 ]; then
  printf '%s\n' "${Y}one-time step:${N} log out and back in so the input group applies — voxyd starts itself after that."
fi
printf '%s\n' ""
printf '%s\n' "${B}How to dictate:${N} click into any text box → press ${B}Ctrl+Shift${N} together → speak → press ${B}Ctrl+V${N} → the whole transcript appears instantly at your cursor. (${D}Ctrl+Shift+V in terminals; Enter also works${N})"
printf '%s\n' "${D}config: $CONFIG_FILE · logs: journalctl --user -u voxyd -f${N}"
