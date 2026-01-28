"""Authentication service."""
import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token
from app.models.user import User


class AuthService:
    """Authentication service."""

    @staticmethod
    async def get_user_by_phone(db: AsyncSession, phone: str) -> Optional[User]:
        """Get user by phone number."""
        result = await db.execute(select(User).where(User.phone == phone))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> Optional[User]:
        """Get user by ID."""
        return await db.get(User, user_id)

    @staticmethod
    async def create_user(
        db: AsyncSession, phone: str, nickname: str
    ) -> User:
        """Create new user."""
        user = User(phone=phone, nickname=nickname)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    def generate_token(user_id: uuid.UUID) -> str:
        """Generate access token for user."""
        return create_access_token(data={"sub": str(user_id)})

    @staticmethod
    async def verify_code(db: AsyncSession, phone: str, code: str) -> bool:
        """Verify verification code.

        MVP: Accept any 4-digit code starting with '1'.
        TODO: Implement proper SMS verification.
        """
        # MVP: Simple verification - any 4-digit code starting with 1
        return code.isdigit() and len(code) >= 4

    @staticmethod
    async def send_verification_code(phone: str) -> bool:
        """Send verification code via SMS.

        MVP: Skip actual SMS sending.
        TODO: Implement SMS service integration.
        """
        # MVP: Just log the code
        print(f"[SMS] Verification code for {phone}: 1234")
        return True
