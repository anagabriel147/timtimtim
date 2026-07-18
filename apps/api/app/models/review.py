from datetime import datetime

from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Review(Base):
    """1:1 com Contract (a avaliação é do contrato, não direto do fornecedor —
    confirmado na varredura do frontend)."""

    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    contract_id: Mapped[int] = mapped_column(ForeignKey("contracts.id"), unique=True)
    reviewer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    rating_overall: Mapped[int]
    rating_atendimento: Mapped[int]
    rating_pontualidade: Mapped[int]
    rating_qualidade: Mapped[int]
    highlights: Mapped[list[str]] = mapped_column(JSON, default=list)
    text: Mapped[str] = mapped_column(String(2000))
    recommend: Mapped[bool]
    show_name: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    contract: Mapped["Contract"] = relationship()
