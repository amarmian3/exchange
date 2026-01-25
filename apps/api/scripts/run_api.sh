  #!/usr/bin/env bash
  set -euo pipefail

  cd "$(dirname "$0")/.."

  # ---- Resolve native engine library path (OS-agnostic) ----
  ENGINE_ROOT="$(cd ../../engine/matching_engine && pwd)"
  CONFIG="${CONFIG:-Release}"
  BASE="$ENGINE_ROOT/build/$CONFIG"

  OS="$(uname -s)"
  case "$OS" in
    MINGW*|MSYS*|CYGWIN*|Windows_NT) LIB="$BASE/matching_engine.dll" ;;
    Darwin)                          LIB="$BASE/libmatching_engine.dylib" ;;
    Linux)                           LIB="$BASE/libmatching_engine.so" ;;
    *) echo "Unsupported OS: $OS" >&2; exit 1 ;;
  esac

  export MATCHING_ENGINE_LIB="${MATCHING_ENGINE_LIB:-$LIB}"
# -----------------------------------------------


# ---- Optional: start ngrok tunnel (set START_NGROK=true) ----
START_NGROK="${START_NGROK:-false}"

if [ "$START_NGROK" = "true" ]; then
  # Locate ngrok binary
  if command -v ngrok >/dev/null 2>&1; then
    NGROK_BIN="ngrok"
  elif command -v ngrok.exe >/dev/null 2>&1; then
    NGROK_BIN="ngrok.exe"
  elif [ -x "./ngrok.exe" ]; then
    NGROK_BIN="./ngrok.exe"
  else
    echo "ngrok not found. Install it or put ngrok.exe on PATH (or alongside this script)." >&2
    exit 1
  fi

  # Check for authtoken (v3 uses ~/.config/ngrok/ngrok.yml)
  NGROK_CFG="${NGROK_CONFIG:-$HOME/.config/ngrok/ngrok.yml}"
  if [ ! -f "$NGROK_CFG" ] || ! grep -qE '^\s*authtoken\s*:' "$NGROK_CFG"; then
    echo "ngrok authtoken not configured. Run: $NGROK_BIN config add-authtoken <TOKEN>" >&2
    exit 1
  fi

  echo "Starting ngrok tunnel -> localhost:$PORT"
  # Start in background, log to file
  "$NGROK_BIN" http "$PORT" --log=stdout > .ngrok.log 2>&1 &
  NGROK_PID=$!

  # Best-effort: wait briefly and print public URL from local ngrok API
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    if command -v curl >/dev/null 2>&1; then
      PUB_URL="$(curl -s http://127.0.0.1:4040/api/tunnels \
        | sed -n 's/.*"public_url":"\([^"]*\)".*/\1/p' \
        | head -n1)"
      if [ -n "${PUB_URL:-}" ]; then
        echo "Public URL: $PUB_URL"
        echo "Swagger:   $PUB_URL/docs"
        break
      fi
    fi
    sleep 0.2
  done

  # Clean up ngrok on exit
  trap 'kill "$NGROK_PID" >/dev/null 2>&1 || true' EXIT
fi
# -----------------------------------------------------------

  export HOST="${HOST:-0.0.0.0}"
  export PORT="${PORT:-8000}"

  echo "MATCHING_ENGINE_LIB=$MATCHING_ENGINE_LIB"
  echo "HOST=$HOST PORT=$PORT"

  uv sync
  uv pip install -e .

  echo "Swagger UI: http://127.0.0.1:$PORT/docs"
  uv run uvicorn api.main:app --host "$HOST" --port "$PORT" --reload
