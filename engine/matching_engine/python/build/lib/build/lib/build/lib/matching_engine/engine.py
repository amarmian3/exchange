from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional

from ._native import _Native, Side


@dataclass(frozen=True)
class EngineResponse:
    symbol: str
    events: list[dict[str, Any]]
    raw: dict[str, Any]
    rc: int


class Engine:
    def __init__(self, dll_path: Optional[str] = None) -> None:
        self._native = _Native(dll_path=dll_path)
        self._handle = self._native.create()

    def close(self) -> None:
        if self._handle:
            self._native.destroy(self._handle)
            self._handle = None  # type: ignore[assignment]

    def __enter__(self) -> "Engine":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        self.close()

    def place_limit(self, symbol: str, user: str, side: Side, price: int, qty: int) -> EngineResponse:
        raw = self._native.place_limit(self._handle, symbol, user, side, price, qty)
        return EngineResponse(symbol=raw.get("symbol", symbol), events=list(raw.get("events", [])), raw=raw, rc=int(raw.get("_rc", -999)))

    def cancel(self, symbol: str, order_id: int) -> EngineResponse:
        raw = self._native.cancel(self._handle, symbol, order_id)
        return EngineResponse(symbol=raw.get("symbol", symbol), events=list(raw.get("events", [])), raw=raw, rc=int(raw.get("_rc", -999)))

    def show_orderbook(self, symbol: str) -> EngineResponse:
        raw = self._native.show_orderbook(self._handle, symbol)
        return EngineResponse(symbol=raw.get("symbol", symbol), events=list(raw.get("events", [])), raw=raw, rc=int(raw.get("_rc", -999)))

    