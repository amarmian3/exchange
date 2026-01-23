# Matching Engine Build & Deployment

This directory contains a cross-platform build script for the native **matching engine**.  
The script compiles the engine into a shared library suitable for dynamic linking from
other components (e.g. FastAPI, Python bindings).

The output artifact is OS-specific:

- **Windows** → `matching_engine.dll`
- **macOS** → `libmatching_engine.dylib`
- **Linux** → `libmatching_engine.so`

---

## Prerequisites

### Required tools

The following tools must be installed before running the build script.

#### CMake (required)
Minimum recommended version: **3.21+**

- Windows: https://cmake.org/download/
- macOS:
  ```bash
  brew install cmake
