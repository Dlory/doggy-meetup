"""Chat models."""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ChatMessageType(str, Enum):
    """Chat message type enum."""

    text = "text"
    voice = "voice"
    location = "location"
    system = "system"


class ChatGroup(Base):
    """Chat group model."""

    __tablename__ = "chat_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    session = relationship("Session", back_populates="chat_group")
    messages = relationship("ChatMessage", back_populates="group", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<ChatGroup {self.name}>"


class ChatMessage(Base):
    """Chat message model."""

    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(UUID(as_uuid=True), ForeignKey("chat_groups.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    message_type = Column(Enum(ChatMessageType), default=ChatMessageType.text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    group = relationship("ChatGroup", back_populates="messages")

    def __repr__(self) -> str:
        return f"<ChatMessage {self.id}>"
