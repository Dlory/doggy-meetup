"""Dog schemas."""
from pydantic import BaseModel, Field
from uuid import UUID
from app.models.dog import DogSize, DogGender


class DogBase(BaseModel):
    """Dog base schema."""

    name: str = Field(..., min_length=1, max_length=50)
    breed: str = Field(..., min_length=1, max_length=50)
    size: DogSize
    gender: DogGender
    age_months: int = Field(..., ge=0, le=360)
    avatar: str | None = None


class DogCreate(DogBase):
    """Dog create schema."""

    pass


class DogResponse(DogBase):
    """Dog response schema."""

    id: UUID
    user_id: UUID
    mbti: str | None = None


class DogUpdate(BaseModel):
    """Dog update schema."""

    name: str | None = Field(None, min_length=1, max_length=50)
    breed: str | None = Field(None, min_length=1, max_length=50)
    size: DogSize | None = None
    gender: DogGender | None = None
    age_months: int | None = Field(None, ge=0, le=360)
    avatar: str | None = None
