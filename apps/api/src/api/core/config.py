from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: Optional[str] = None
    MATCHING_ENGINE_LIB: str
    HOST: str = "127.0.0.1"
    PORT: int = 8000

settings = Settings()

