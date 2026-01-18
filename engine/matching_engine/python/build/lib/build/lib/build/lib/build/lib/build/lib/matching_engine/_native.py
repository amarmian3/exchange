from __future__ import annotations

import ctypes as ct
import json
import os
from pathlib import Path
from typing import Any, Dict, Literal, Optional, Tuple

Side = Literal[0, 1]  # 0=Bid, 1=Ask


class _Native:
    """
    Low-level ctypes binding to matching_engine.dll.

    You normally shouldn't use this directly; use matching_engine.Engine instead.
    """

    def __init__(self, dll_path: Optional[str | os.PathLike[str]] = None) -> None:
        path = Path(dll_path) if dll_path else self._default_dll_path()
        if not path.exists():
            raise FileNotFoundError(f"DLL not found: {path}")

        # Allow dependent DLL resolution (Windows)
        if hasattr(os, "add_dll_directory"):
            os.add_dll_directory(str(path.parent))

        print("LOADING DLL:", dll_path)

        self._dll = ct.CDLL(str(path))
        self._bind()

    def _default_dll_path(self) -> Path:
        """
        Finds the DLL in typical build output folders.

        Override by passing dll_path to Engine(...) or setting MATCHING_ENGINE_DLL.
        """
        env = os.getenv("MATCHING_ENGINE_DLL")
        if env:
            return Path(env)

        # repo root = .../matching_engine/python/matching_engine/_native.py -> parents[3] == matching_engine/
        repo = Path(__file__).resolve().parents[3]

        candidates = [
            repo / "build" / "Release" / "matching_engine.dll",
            repo / "build" / "Debug" / "matching_engine.dll",
            repo / "out" / "build" / "x64-release" / "matching_engine.dll",
            repo / "out" / "build" / "x64-debug" / "matching_engine.dll",
        ]
        for c in candidates:
            if c.exists():
                return c

        # Fall back to first candidate (for a helpful error message)
        return candidates[0]

    def _bind(self) -> None:
        "This defines the argument and types for each of the functions in c_api"
        d = self._dll

        # ct.c_void_p -> function returns a pointer (void*)
        # default assumes int (32 bit) vs pointer (64 bit) 
        d.me_create.restype = ct.c_void_p

        d.me_destroy.argtypes = [ct.c_void_p]
        d.me_destroy.restype = None

        d.me_place_limit.argtypes = [
            ct.c_void_p,  # engine
            ct.c_char_p,  # symbol
            ct.c_char_p,  # user
            ct.c_int,     # side
            ct.c_int64,   # price
            ct.c_int64,   # qty
            ct.POINTER(ct.c_char_p),   # out_json
            ct.POINTER(ct.c_size_t),   # out_len
        ]
        d.me_place_limit.restype = ct.c_int

        d.me_cancel.argtypes = [
            ct.c_void_p,
            ct.c_char_p,
            ct.c_uint64,
            ct.POINTER(ct.c_char_p),
            ct.POINTER(ct.c_size_t),
        ]
        d.me_cancel.restype = ct.c_int

        d.me_show_orderbook.argtypes = [
            ct.c_void_p, # engine
            ct.c_char_p, # symbol
            ct.POINTER(ct.c_char_p), # out_json 
            ct.POINTER(ct.c_size_t), # out_len
        ]
        d.me_show_orderbook.restype = ct.c_int

        d.me_free.argtypes = [ct.c_char_p]
        d.me_free.restype = None

    def create(self) -> ct.c_void_p:
        "This runs the c_api defined func me_create, returning an error OR a pointer handle to the object"
        p = self._dll.me_create()
        if not p:
            raise RuntimeError("me_create() returned NULL")
        return ct.c_void_p(p)

    def destroy(self, engine: ct.c_void_p) -> None:
        "This runs the c_api defined func me_destroy (deletes the pointer handle in memory of engine)"
        self._dll.me_destroy(engine)

    def place_limit(
        self,
        engine: ct.c_void_p,
        symbol: str,
        user: str,
        side: Side,
        price: int,
        qty: int,
    ) -> Dict[str, Any]:
        "symbol.encode(utf-8) is to convert the python str type (unicode != bytes) into c++(char* = bytes)"
        out = ct.c_char_p()
        out_len = ct.c_size_t()
        rc = self._dll.me_place_limit(
            engine,
            symbol.encode("utf-8"),
            user.encode("utf-8"),
            int(side),
            ct.c_int64(price),
            ct.c_int64(qty),
            ct.byref(out),
            ct.byref(out_len),
        )
        
        # out and out_len -> pointers are passed to the me_place_limit function and updated in memory into bytes representing a json 
        payload = self._consume_json(out, out_len)
        payload["_rc"] = int(rc)
        return payload

    def cancel(self, engine: ct.c_void_p, symbol: str, order_id: int) -> Dict[str, Any]:
        out = ct.c_char_p()
        out_len = ct.c_size_t()
        rc = self._dll.me_cancel(
            engine,
            symbol.encode("utf-8"),
            ct.c_uint64(order_id),
            ct.byref(out),
            ct.byref(out_len),
        )
        payload = self._consume_json(out, out_len)
        payload["_rc"] = int(rc)
        return payload

    def show_orderbook(self, engine: ct.c_void_p, symbol: str) -> Dict[str, Any]:
        "Retrieve the current orderbook for a specific symbol"
        out = ct.c_char_p()
        out_len = ct.c_size_t()
        rc = self._dll.me_show_orderbook(
            engine, 
            symbol.encode("utf-8"),
            ct.byref(out),
            ct.byref(out_len),
        )
        payload = self._consume_json(out, out_len)
        payload["_rc"] = int(rc)
        return payload

    def _consume_json(self, out: ct.c_char_p, out_len: ct.c_size_t) -> Dict[str, Any]:
        "Converts c++ utf-8 (defined as raw bytes of json text) into python str and returns this a dictionary"
        if not out.value:
            return {"symbol": "", "events": [], "error": "empty response"}
        try:
            s = ct.string_at(out, out_len.value).decode("utf-8", errors="replace")
            return json.loads(s)
        finally:
            # Important: must free using me_free (not Python free)
            self._dll.me_free(out)


