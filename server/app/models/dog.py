"""Dog model."""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.database import Base


class DogSize(str, Enum):
    """Dog size enum."""

    small = "small"
    medium = "medium"
    large = "large"
    giant = "giant"


class DogGender(str, Enum):
    """Dog gender enum."""

    male = "male"
    female = "female"


class Dog(Base):
    """Dog model."""

    __tablename__ = "dogs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(50), nullable=False)
    breed = Column(String(50), nullable=False)
    size = Column(Enum(DogSize), nullable=False)
    gender = Column(Enum(DogGender), nullable=False)
    age_months = Column(Integer, nullable=False)
    mbti = Column(String(4), nullable=True)
    avatar = Column(String(500), nullable=True)
    images = Column(ARRAY(String), nullable=True, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="dogs")

    def __repr__(self) -> str:
        return f"<Dog {self.name}>"
