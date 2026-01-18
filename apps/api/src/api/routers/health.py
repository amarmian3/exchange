from fastapi import APIRouter
from api.services.matching import init_engine

router = APIRouter()

@router.get("/health")
def health():
    # try init engine (optional)
    init_engine()
    return {"ok": True}
