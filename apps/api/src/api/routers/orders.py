from __future__ import annotations
from typing import Any, Literal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from api.services.matching import with_engine_lock, get_engine

Side = Literal[0, 1]

router = APIRouter()

class PlaceLimitRequest(BaseModel):
    symbol: str = Field(..., examples=["EURUSD"])
    user: str = Field(..., examples=["u1"])
    side: Side = Field(..., description="0=Bid, 1=Ask")
    price: int = Field(..., ge=0)
    qty: int = Field(..., gt=0)

class CancelRequest(BaseModel):
    symbol: str

class EngineResponse(BaseModel):
    symbol: str
    events: list[dict[str, Any]]
    rc: int
    raw: dict[str, Any]

@router.post("/orders", response_model=EngineResponse)
def place_limit(req: PlaceLimitRequest):
    try:
        eng = get_engine()
        with with_engine_lock():
            eng.place_limit(req.symbol, req.user, req.side, req.price, req.qty)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/orders/{order_id}", response_model=EngineResponse)
def cancel(order_id: int, req: CancelRequest):
    try:
        eng = get_engine()
        with with_engine_lock():
            res = eng.cancel(req.symbol, order_id)
            
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