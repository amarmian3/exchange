#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Path to the built DLL (Windows dev under Git Bash).
# If you're running in Linux/WSL/container, point this at .so instead.
ENGINE_DLL="$(cd ../../engine/matching_engine && pwd)/build/Release/matching_engine.dll"
export MATCHING_ENGINE_LIB="${MATCHING_ENGINE_LIB:-$ENGINE_DLL}"

export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-8000}"

echo "MATCHING_ENGINE_LIB=$MATCHING_ENGINE_LIB"
echo "HOST=$HOST PORT=$PORT"

uv sync
uv pip install -e .

echo "Swagger UI: http://127.0.0.1:$PORT/docs"
uv run uvicorn api.main:app --host "$HOST" --port "$PORT" --reload
