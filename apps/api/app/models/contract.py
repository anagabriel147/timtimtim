from datetime import datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import EscrowStatusEnum, ServiceStatusEnum


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[int] = mapped_column(primary_key=True)
    proposal_id: Mapped[int] = mapped_column(ForeignKey("proposals.id"), unique=True)
    contratante_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), index=True)
    contract_code: Mapped[str] = mapped_column(String(30), unique=True)
    value: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    installments_count: Mapped[int] = mapped_column(default=1)
    # Dois estados independentes, confirmados na varredura do frontend:
    service_status: Mapped[ServiceStatusEnum] = mapped_column(
        default=ServiceStatusEnum.CONFIRMADO
    )
    payment_status: Mapped[EscrowStatusEnum] = mapped_column(
        default=EscrowStatusEnum.AGUARDANDO
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    proposal: Mapped["Proposal"] = relationship()
    event: Mapped["Event"] = relationship()
    contratante: Mapped["User"] = relationship(foreign_keys=[contratante_id])
    provider: Mapped["User"] = relationship(foreign_keys=[provider_id])
