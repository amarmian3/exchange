from __future__ import annotations
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.services.matching import with_engine_lock, get_engine

from enum import IntEnum

class Side(IntEnum):
    BUY = 0
    SELL = 1

router = APIRouter()

class EngineResponse(BaseModel):
    symbol: str
    events: list[dict[str, Any]]
    rc: int
    raw: dict[str, Any]


@router.post("/orders", response_model=EngineResponse)
def place_limit(    
    symbol: str,
    user: str,
    side: Side,
    price: int,
    qty: int,
    ) -> EngineResponse:
    try:
        eng = get_engine()
        with with_engine_lock():
            res = eng.place_limit(symbol, user, side, price, qty)

        return EngineResponse(symbol=res.symbol, events=res.events, rc=res.rc, raw=res.raw)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/orders/{order_id}", response_model=EngineResponse)
def cancel(order_id: int, symbol: str):
    try:
        eng = get_engine()
        with with_engine_lock():
            res = eng.cancel(symbol, order_id)
            
        return EngineResponse(symbol=res.symbol, events=res.events, rc=res.rc, raw=res.raw)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/orderbook/{symbol}", response_model=EngineResponse)
def show_orderbook(symbol: str) -> EngineResponse:
    try:
        eng = get_engine()
        with with_engine_lock():
            res = eng.show_orderbook(symbol)

        return EngineResponse(symbol=res.symbol, events=res.events, rc=res.rc, raw=res.raw)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# TODO: Each user should be able to query what they bids and asks they have
# TODO: Each user should be able to see what they own
# TODO: Fetch a list of all events which have occured on the orderbook since open