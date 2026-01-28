"""Application configuration"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Doggy Meetup API"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/doggymeetup"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Mapbox
    MAPBOX_ACCESS_TOKEN: str = ""
    MAPBOX_STYLE_URL: str = "mapbox://styles/mapbox/streets-v12"

    # Firebase
    FIREBASE_SERVICE_ACCOUNT_KEY: str = ""

    # AWS S3
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_BUCKET_NAME: str = ""
    AWS_REGION: str = "us-east-1"

    class Config:
        env_file = ".env"


settings = Settings()
