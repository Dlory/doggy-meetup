"""Authentication schemas."""
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse


class SendCodeRequest(BaseModel):
    """Send verification code request."""

    phone: str = Field(..., min_length=11, max_length=11)


class LoginRequest(BaseModel):
    """Login request with phone and code."""

    phone: str = Field(..., min_length=11, max_length=11)
    code: str = Field(..., min_length=4, max_length=6)


class RegisterRequest(BaseModel):
    """Register request."""

    phone: str = Field(..., min_length=11, max_length=11)
    nickname: str = Field(..., min_length=1, max_length=50)
    code: str = Field(..., min_length=4, max_length=6)


class TokenResponse(BaseModel):
    """Token response."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
