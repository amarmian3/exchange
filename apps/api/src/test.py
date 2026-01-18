import ctypes as ct
import os
from pathlib import Path

DLL_PATH = Path(r"C:\Users\Amar\Documents\Coding\exchange\engine\matching_engine\build\Release\matching_engine.dll")

EXPECTED_EXPORTS = [
    "me_create",
    "me_destroy",
    "me_place_limit",
    "me_cancel",
    "me_show_orderbook",
    "me_free",
]

def load_dll(path: Path) -> ct.CDLL:
    if not path.exists():
        raise FileNotFoundError(f"DLL not found: {path}")

    # Helps Windows find dependent DLLs if any are in the same folder
    os.add_dll_directory(str(path.parent))

    d = ct.CDLL(str(path))
    print("Loaded DLL:", path)
    return d

def check_exports(d: ct.CDLL, names: list[str]) -> None:
    missing: list[str] = []
    present: list[str] = []

    for name in names:
        try:
            getattr(d, name)
            present.append(name)
        except AttributeError:
            missing.append(name)

    print("\nExport check:")
    for n in present:
        print("  OK  ", n)
    for n in missing:
        print("  MISS", n)

    if missing:
        raise RuntimeError(f"DLL is missing exports: {missing}")

def bind_minimal_signatures(d: ct.CDLL) -> None:
    # Bind only what we need for a smoke test.
    d.me_create.argtypes = []
    d.me_create.restype = ct.c_void_p

    d.me_destroy.argtypes = [ct.c_void_p]
    d.me_destroy.restype = None

    d.me_free.argtypes = [ct.c_void_p]  # generic pointer to allocated buffer
    d.me_free.restype = None

def smoke_engine_path_and_call(d: ct.CDLL) -> None:
    # This checks that the loaded DLL actually works for basic lifecycle calls.
    h = d.me_create()
    if not h:
        raise RuntimeError("me_create returned NULL (engine not created)")

    d.me_destroy(h)
    print("\nEngine lifecycle smoke test: OK (me_create/me_destroy)")

def check_python_engine_path_and_load() -> None:
    # This checks which matching_engine Python package is being imported,
    # and then tries to construct Engine with an explicit dll_path.
    try:
        import matching_engine
        print("\nPython package:", matching_engine.__file__)
    except Exception as e:
        raise RuntimeError(f"Failed to import matching_engine package: {e}") from e

    from matching_engine import Engine

    # If Engine prints the path internally (your debug print), you'll see it here.
    eng = Engine(dll_path=str(DLL_PATH))
    try:
        print("Engine(dll_path=...) constructed OK with:", DLL_PATH)
    finally:
        # If your Engine has close(), use it to free native handle.
        if hasattr(eng, "close"):
            eng.close()

def main() -> None:
    d = load_dll(DLL_PATH)
    check_exports(d, EXPECTED_EXPORTS)
    bind_minimal_signatures(d)
    smoke_engine_path_and_call(d)
    check_python_engine_path_and_load()

if __name__ == "__main__":
    main()
