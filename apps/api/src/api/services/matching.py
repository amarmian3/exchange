from __future__ import annotations
import threading
from matching_engine import Engine
from api.core.config import settings

_lock = threading.Lock()
_engine: Engine | None = None


def init_engine() -> None:
    global _engine
    if _engine is None:
        _engine = Engine(dll_path=settings.MATCHING_ENGINE_LIB)


def get_engine() -> Engine:
    assert _engine is not None, "Matching engine not initialized"
    return _engine


def with_engine_lock():
    return _lock

if __name__ == "__main__":
    aa = Engine()
    