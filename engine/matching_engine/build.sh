#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

CONFIG="${CONFIG:-Release}"
BUILD_DIR="${BUILD_DIR:-build}"

OS="$(uname -s)"
case "$OS" in
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    echo "Building matching_engine (Windows/MSVC)..."
    # If you're in Git Bash, cmd.exe exists and this uses your existing build.bat
    cmd.exe /c "$(cygpath -w "$(pwd)/build.bat")"
    ;;
  Darwin)
    echo "Building matching_engine (macOS/clang)..."
    cmake -S . -B "$BUILD_DIR" -DCMAKE_BUILD_TYPE="$CONFIG"
    cmake --build "$BUILD_DIR" -j
    ;;
  Linux)
    echo "Building matching_engine (Linux/gcc/clang)..."
    cmake -S . -B "$BUILD_DIR" -DCMAKE_BUILD_TYPE="$CONFIG"
    cmake --build "$BUILD_DIR" -j
    ;;
  *)
    echo "Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

echo
echo "Build complete."
echo "Windows:  $BUILD_DIR/$CONFIG/matching_engine.dll"
echo "macOS:    $BUILD_DIR/libmatching_engine.dylib"
echo "Linux:    $BUILD_DIR/libmatching_engine.so"
