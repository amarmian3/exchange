#!/usr/bin/env bash
set -euo pipefail

CONFIG="${1:-Release}"
BUILD_DIR="${BUILD_DIR:-build}"

cmake -S . -B "$BUILD_DIR"
cmake --build "$BUILD_DIR" --config "$CONFIG" -j

echo
echo "Build finished: $BUILD_DIR/$CONFIG"
