"""Dog service."""
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.dog import Dog
from app.schemas.dog import DogCreate, DogUpdate


class DogService:
    """Dog service."""

    @staticmethod
    async def get_user_dogs(db: AsyncSession, user_id: UUID) -> list[Dog]:
        """Get all dogs for a user."""
        result = await db.execute(
            select(Dog).where(Dog.user_id == user_id).order_by(Dog.created_at.desc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_dog_by_id(db: AsyncSession, dog_id: UUID) -> Optional[Dog]:
        """Get dog by ID."""
        return await db.get(Dog, dog_id)

    @staticmethod
    async def create_dog(
        db: AsyncSession, user_id: UUID, data: DogCreate
    ) -> Dog:
        """Create new dog."""
        dog = Dog(**data.model_dump(), user_id=user_id)
        db.add(dog)
        await db.commit()
        await db.refresh(dog)
        return dog

    @staticmethod
    async def update_dog(
        db: AsyncSession, dog_id: UUID, data: DogUpdate
    ) -> Optional[Dog]:
        """Update dog."""
        dog = await db.get(Dog, dog_id)
        if not dog:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(dog, field, value)

        await db.commit()
        await db.refresh(dog)
        return dog

    @staticmethod
    async def delete_dog(db: AsyncSession, dog_id: UUID) -> bool:
        """Delete dog."""
        dog = await db.get(Dog, dog_id)
        if not dog:
            return False

        await db.delete(dog)
        await db.commit()
        return True

    @staticmethod
    async def check_ownership(db: AsyncSession, dog_id: UUID, user_id: UUID) -> bool:
        """Check if user owns the dog."""
        dog = await db.get(Dog, dog_id)
        return dog is not None and dog.user_id == user_id
