@echo off
setlocal

set BUILD_DIR=build
set CONFIG=Release

cmake -S . -B %BUILD_DIR% -G "Visual Studio 17 2022" -A x64 || exit /b 1
cmake --build %BUILD_DIR% --config %CONFIG% || exit /b 1

echo.
echo Build finished: %BUILD_DIR%\%CONFIG%\matching_engine.dll
