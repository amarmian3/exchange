from contextlib import asynccontextmanager
from fastapi import FastAPI

from api.routers import health, orders
from api.services.matching import init_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- startup ----
    init_engine()
    yield
    # ---- shutdown ----
    # (optional later: engine shutdown / flush / metrics)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Exchange API",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    app.include_router(health.router, tags=["health"])
    app.include_router(orders.router, prefix="/v1", tags=["orders"])

    return app


app = create_app()
