from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import BillingCycleEnum, PlanRoleEnum, SubscriptionStatusEnum


class Plan(Base):
    """Assinatura SaaS da plataforma — só fornecedor/assessor. O contratante
    não tem plano (confirmado na varredura: orçamento de evento é conceito
    totalmente diferente disto)."""

    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    role: Mapped[PlanRoleEnum] = mapped_column()
    name: Mapped[str] = mapped_column(String(100))
    billing_cycle: Mapped[BillingCycleEnum] = mapped_column()
    price_cents: Mapped[int]
    is_active: Mapped[bool] = mapped_column(default=True)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"), index=True)
    status: Mapped[SubscriptionStatusEnum] = mapped_column(
        default=SubscriptionStatusEnum.TRIAL
    )
    started_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    current_period_end: Mapped[datetime | None]

    plan: Mapped["Plan"] = relationship()
