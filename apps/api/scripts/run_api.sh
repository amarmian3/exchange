ENGINE_ROOT="../../engine/matching_engine"
ENGINE_BUILD_DIR="$ENGINE_ROOT/build/Release"

OS="$(uname -s)"
case "$OS" in
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    ENGINE_LIB="$ENGINE_BUILD_DIR/matching_engine.dll"
    if [[ ! -f "$ENGINE_LIB" ]]; then
      echo "Engine DLL not found. Building (Windows)..."
      cmd.exe /c "$(cygpath -w "$ENGINE_ROOT/build.bat")"
    fi
    ;;
  Darwin)
    ENGINE_LIB="$ENGINE_BUILD_DIR/libmatching_engine.dylib"
    if [[ ! -f "$ENGINE_LIB" ]]; then
      echo "Engine dylib not found. Building (macOS)..."
      (cd "$ENGINE_ROOT" && bash "./build.sh" Release)
    fi
    ;;
  Linux)
    ENGINE_LIB="$ENGINE_BUILD_DIR/libmatching_engine.so"
    if [[ ! -f "$ENGINE_LIB" ]]; then
      echo "Engine so not found. Building (Linux)..."
      (cd "$ENGINE_ROOT" && bash "./build.sh" Release)
    fi
    ;;
  *)
    echo "Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

export MATCHING_ENGINE_LIB="$(cd "$(dirname "$ENGINE_LIB")" && pwd)/$(basename "$ENGINE_LIB")"


export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-8000}"

echo "MATCHING_ENGINE_LIB=$MATCHING_ENGINE_LIB"
echo "HOST=$HOST PORT=$PORT"

uv sync
uv pip install -e .

echo "Swagger UI: http://127.0.0.1:$PORT/docs"
uv run uvicorn api.main:app --host "$HOST" --port "$PORT" --reload
