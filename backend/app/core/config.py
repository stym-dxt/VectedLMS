from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000"
    GOOGLE_MEET_BASE_URL: str = "https://meet.google.com"
    UPLOAD_DIR: str = "./uploads"
    VIDEO_DIR: str = "./uploads/videos"
    MAX_UPLOAD_SIZE: int = 1073741824
    GOOGLE_APPLICATION_CREDENTIALS: str = ""

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()



