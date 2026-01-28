"""User schemas."""
from pydantic import BaseModel, Field
from uuid import UUID


class UserBase(BaseModel):
    """User base schema."""

    nickname: str = Field(..., min_length=1, max_length=50)
    avatar: str | None = None


class UserResponse(UserBase):
    """User response schema."""

    id: UUID
    phone: str | None = None


class UserUpdate(BaseModel):
    """User update schema."""

    nickname: str | None = Field(None, min_length=1, max_length=50)
    avatar: str | None = None
