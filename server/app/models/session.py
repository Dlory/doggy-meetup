"""Session model."""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, JSON, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class SessionStatus(str, Enum):
    """Session status enum."""

    recruiting = "recruiting"
    full = "full"
    upcoming = "upcoming"
    ended = "ended"
    cancelled = "cancelled"


class Session(Base):
    """Session model."""

    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    title = Column(String(100), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    max_dogs = Column(Integer, nullable=False)
    requirements = Column(JSON, nullable=True)
    status = Column(Enum(SessionStatus), default=SessionStatus.recruiting)
    chat_group_id = Column(UUID(as_uuid=True), ForeignKey("chat_groups.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    location = relationship("Location", back_populates="sessions")
    chat_group = relationship("ChatGroup", back_populates="session", foreign_keys=[chat_group_id])

    def __repr__(self) -> str:
        return f"<Session {self.title}>"


# Association table for session participants
session_participants = Table(
    "session_participants",
    Base.metadata,
    Column("session_id", UUID(as_uuid=True), ForeignKey("sessions.id"), primary_key=True),
    Column("dog_id", UUID(as_uuid=True), ForeignKey("dogs.id"), primary_key=True),
    Column("joined_at", DateTime, default=datetime.utcnow, nullable=False),
)
