#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ENGINE_ROOT="../../engine/matching_engine"
ENGINE_BUILD_DIR="$ENGINE_ROOT/build/Release"
ENGINE_DLL="$ENGINE_BUILD_DIR/matching_engine.dll"
BUILD_BAT="$ENGINE_ROOT/build.bat"

# Build DLL if missing
if [[ ! -f "$ENGINE_DLL" ]]; then
  echo "Matching engine DLL not found. Building..."
  cmd.exe /c "$(cygpath -w "$BUILD_BAT")"
fi

export MATCHING_ENGINE_LIB="$(cd "$ENGINE_BUILD_DIR" && pwd)/matching_engine.dll"

export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-8000}"

echo "MATCHING_ENGINE_LIB=$MATCHING_ENGINE_LIB"
echo "HOST=$HOST PORT=$PORT"

uv sync
uv pip install -e .

echo "Swagger UI: http://127.0.0.1:$PORT/docs"
uv run uvicorn api.main:app --host "$HOST" --port "$PORT" --reload
