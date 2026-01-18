from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Literal, Optional

from ._native import _Native, Side


@dataclass(frozen=True)
class EngineResponse:
    """
    Result returned from the matching engine.

    Attributes
    ----------
    symbol:
        Market symbol (e.g. "EURUSD").
    events:
        List of event dicts, e.g. accepted/trade/canceled/rejected.
    raw:
        Full parsed JSON response from the C++ engine.
    rc:
        Return code from the C API (0 usually means success).
    """
    symbol: str
    events: list[dict[str, Any]]
    raw: dict[str, Any]
    rc: int


class Engine:
    """
    High-level Python wrapper around the C++ matching engine DLL.

    Parameters
    ----------
    dll_path:
        Optional path to matching_engine.dll. If not provided, tries common build locations,
        or reads MATCHING_ENGINE_DLL env var.

    Examples
    --------
    >>> from matching_engine import Engine
    >>> eng = Engine()
    >>> r = eng.place_limit("EURUSD", "u1", side=0, price=100, qty=5)
    >>> r.events
    """

    def __init__(self, dll_path: Optional[str] = None) -> None:
        self._native = _Native(dll_path=dll_path)
        self._handle = self._native.create()

    def close(self) -> None:
        """Destroy the underlying C++ engine instance."""
        if self._handle:
            self._native.destroy(self._handle)
            self._handle = None  # type: ignore[assignment]

    def __enter__(self) -> "Engine":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        self.close()

    def place_limit(
        self,
        symbol: str,
        user: str,
        side: Side,
        price: int,
        qty: int,
    ) -> EngineResponse:
        """
        Place a LIMIT order.

        side: 0 = Bid, 1 = Ask
        """
        raw = self._native.place_limit(self._handle, symbol, user, side, price, qty)
        return EngineResponse(
            symbol=raw.get("symbol", symbol),
            events=list(raw.get("events", [])),
            raw=raw,
            rc=int(raw.get("_rc", -999)),
        )

    def cancel(self, symbol: str, order_id: int) -> EngineResponse:
        """Cancel an existing order by id."""
        raw = self._native.cancel(self._handle, symbol, order_id)
        return EngineResponse(
            symbol=raw.get("symbol", symbol),
            events=list(raw.get("events", [])),
            raw=raw,
            rc=int(raw.get("_rc", -999)),
        )

    def show_orderbook(self, symbol:str) -> EngineResponse:
        """Show Orderbook for a symbol"""
        raw = self._native.show_orderbook(self._handle, symbol)
        return EngineResponse(
            symbol=raw.get("symbol", symbol),
            events=list(raw.get("events", [])),
            raw=raw,
            rc=int(raw.get("_rc", -999)),
        )

