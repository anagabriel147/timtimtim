from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import ProposalStatusEnum, QuoteRequestStatusEnum


class QuoteRequest(Base):
    """Unifica o `Opportunity` do dashboard do fornecedor com o pedido de
    orçamento solto do marketplace — mesmo conceito, duas telas diferentes."""

    __tablename__ = "quote_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int | None] = mapped_column(ForeignKey("events.id"), index=True)
    contratante_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    provider_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), index=True)
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("service_categories.id"), index=True
    )
    source: Mapped[str] = mapped_column(String(20))  # 'marketplace' | 'assessor' | 'direto'
    budget: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    vision_text: Mapped[str | None] = mapped_column(String(2000))
    status: Mapped[QuoteRequestStatusEnum] = mapped_column(
        default=QuoteRequestStatusEnum.ABERTO
    )
    expires_at: Mapped[datetime | None]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    contratante: Mapped["User"] = relationship(foreign_keys=[contratante_id])
    provider: Mapped["User | None"] = relationship(foreign_keys=[provider_id])
    event: Mapped["Event | None"] = relationship()
    category: Mapped["ServiceCategory | None"] = relationship()
    proposals: Mapped[list["Proposal"]] = relationship(back_populates="quote_request")


class Proposal(Base):
    __tablename__ = "proposals"

    id: Mapped[int] = mapped_column(primary_key=True)
    quote_request_id: Mapped[int] = mapped_column(
        ForeignKey("quote_requests.id"), index=True
    )
    provider_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("service_categories.id"), index=True
    )
    deadline: Mapped[date | None]
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    payment_term: Mapped[str | None] = mapped_column(String(100))
    validity_days: Mapped[int | None]
    scope_text: Mapped[str | None] = mapped_column(String(4000))
    notes: Mapped[str | None] = mapped_column(String(2000))
    status: Mapped[ProposalStatusEnum] = mapped_column(default=ProposalStatusEnum.ANALISE)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    quote_request: Mapped["QuoteRequest"] = relationship(back_populates="proposals")
    provider: Mapped["User"] = relationship()
    category: Mapped["ServiceCategory | None"] = relationship()
    items: Mapped[list["ProposalItem"]] = relationship(
        back_populates="proposal", cascade="all, delete-orphan"
    )


class ProposalItem(Base):
    __tablename__ = "proposal_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    proposal_id: Mapped[int] = mapped_column(ForeignKey("proposals.id"), index=True)
    description: Mapped[str] = mapped_column(String(300))
    qty: Mapped[int] = mapped_column(default=1)
    unit: Mapped[str | None] = mapped_column(String(30))
    unit_value: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    proposal: Mapped["Proposal"] = relationship(back_populates="items")
