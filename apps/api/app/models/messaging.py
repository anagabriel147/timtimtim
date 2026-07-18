from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import MessageStatusEnum


class Conversation(Base):
    """Unifica ChatMessage/AdvisorChatMessage/SupplierChatMessage do frontend —
    a mesma forma repetida 3x (contratante/fornecedor/assessor)."""

    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(primary_key=True)
    contratante_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    event_id: Mapped[int | None] = mapped_column(ForeignKey("events.id"), index=True)
    archived: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    contratante: Mapped["User"] = relationship(foreign_keys=[contratante_id])
    provider: Mapped["User"] = relationship(foreign_keys=[provider_id])
    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation", cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversations.id"), index=True)
    sender_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), index=True)
    sender_role: Mapped[str] = mapped_column(String(20))  # inclui 'system'
    text: Mapped[str | None] = mapped_column(String(4000))
    link_label: Mapped[str | None] = mapped_column(String(100))
    link_href: Mapped[str | None] = mapped_column(String(300))
    image_url: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[MessageStatusEnum] = mapped_column(default=MessageStatusEnum.ENVIADA)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    conversation: Mapped["Conversation"] = relationship(back_populates="messages")
