#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

CONFIG="${CONFIG:-Release}"
BUILD_DIR="${BUILD_DIR:-build}"

OS="$(uname -s)"
case "$OS" in
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    echo "Building matching_engine (Windows/CMake)..."
    cmake -S . -B "$BUILD_DIR" -G "Visual Studio 17 2022" -A x64
    cmake --build "$BUILD_DIR" --config "$CONFIG" -j
    ;;
  Darwin)
    echo "Building matching_engine (macOS/clang)..."
    cmake -S . -B "$BUILD_DIR/$CONFIG" \
      -DCMAKE_BUILD_TYPE="$CONFIG" \
      -DCMAKE_OSX_ARCHITECTURES=arm64
    cmake --build "$BUILD_DIR/$CONFIG" -j
    ;;
  Linux)
    echo "Building matching_engine (Linux/gcc/clang)..."
    cmake -S . -B "$BUILD_DIR/$CONFIG" -DCMAKE_BUILD_TYPE="$CONFIG"
    cmake --build "$BUILD_DIR/$CONFIG" -j
    ;;
  *)
    echo "Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

# Sanity check: ensure the expected artifact exists
case "$OS" in
  MINGW*|MSYS*|CYGWIN*|Windows_NT) ART="$BUILD_DIR/$CONFIG/matching_engine.dll" ;;
  Darwin)                          ART="$BUILD_DIR/$CONFIG/libmatching_engine.dylib" ;;
  Linux)                           ART="$BUILD_DIR/$CONFIG/libmatching_engine.so" ;;
esac

if [[ ! -f "$ART" ]]; then
  echo "ERROR: expected artifact not found: $ART" >&2
  exit 1
fi

echo
echo "Build complete."
echo "Windows:  $BUILD_DIR/$CONFIG/matching_engine.dll"
echo "macOS:    $BUILD_DIR/$CONFIG/libmatching_engine.dylib"
echo "Linux:    $BUILD_DIR/$CONFIG/libmatching_engine.so"