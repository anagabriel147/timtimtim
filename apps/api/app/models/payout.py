from datetime import datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import CommissionStatusEnum, PayoutStatusEnum


class ProviderPayout(Base):
    """Carteira do fornecedor — tabela separada de AssessorPayout de propósito
    (mesma forma hoje, mas as regras devem divergir no futuro)."""

    __tablename__ = "provider_payouts"

    id: Mapped[int] = mapped_column(primary_key=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    method: Mapped[str] = mapped_column(String(20), default="pix")
    pix_key: Mapped[str | None] = mapped_column(String(160))
    status: Mapped[PayoutStatusEnum] = mapped_column(default=PayoutStatusEnum.ANALISE)
    reference: Mapped[str | None] = mapped_column(String(60))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class AssessorPayout(Base):
    """Carteira do assessor — ver nota em ProviderPayout."""

    __tablename__ = "assessor_payouts"

    id: Mapped[int] = mapped_column(primary_key=True)
    assessor_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    method: Mapped[str] = mapped_column(String(20), default="pix")
    pix_key: Mapped[str | None] = mapped_column(String(160))
    status: Mapped[PayoutStatusEnum] = mapped_column(default=PayoutStatusEnum.ANALISE)
    reference: Mapped[str | None] = mapped_column(String(60))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class Commission(Base):
    """Como o assessor ganha em cima da venda de um fornecedor que ele indicou."""

    __tablename__ = "commissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    assessor_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    contract_id: Mapped[int] = mapped_column(ForeignKey("contracts.id"), index=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    percent: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    status: Mapped[CommissionStatusEnum] = mapped_column(
        default=CommissionStatusEnum.PENDENTE
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    contract: Mapped["Contract"] = relationship()
