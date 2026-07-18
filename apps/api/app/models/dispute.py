from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import (
    DisputeCategoryEnum,
    DisputeResolutionEnum,
    DisputeSeverityEnum,
    DisputeStatusEnum,
)


class Dispute(Base):
    __tablename__ = "disputes"

    id: Mapped[int] = mapped_column(primary_key=True)
    contract_id: Mapped[int] = mapped_column(ForeignKey("contracts.id"), index=True)
    opened_by_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    respondent_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    category: Mapped[DisputeCategoryEnum] = mapped_column()
    severity: Mapped[DisputeSeverityEnum] = mapped_column()
    incident_date: Mapped[date | None]
    statement_text: Mapped[str] = mapped_column(String(2000))
    requested_resolution: Mapped[DisputeResolutionEnum] = mapped_column()
    requested_value: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    status: Mapped[DisputeStatusEnum] = mapped_column(default=DisputeStatusEnum.ABERTA)
    deadline_at: Mapped[datetime | None]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    contract: Mapped["Contract"] = relationship()
    opened_by: Mapped["User"] = relationship(foreign_keys=[opened_by_user_id])
    respondent: Mapped["User"] = relationship(foreign_keys=[respondent_user_id])
    evidences: Mapped[list["DisputeEvidence"]] = relationship(
        back_populates="dispute", cascade="all, delete-orphan"
    )
    events: Mapped[list["DisputeEvent"]] = relationship(
        back_populates="dispute", cascade="all, delete-orphan"
    )


class DisputeEvidence(Base):
    __tablename__ = "dispute_evidences"

    id: Mapped[int] = mapped_column(primary_key=True)
    dispute_id: Mapped[int] = mapped_column(ForeignKey("disputes.id"), index=True)
    uploader_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    file_url: Mapped[str] = mapped_column(String(500))
    filename: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    dispute: Mapped["Dispute"] = relationship(back_populates="evidences")


class DisputeEvent(Base):
    """Timeline/auditoria da disputa — o estado visual (done/alert/current) é
    calculado na API a partir de status + ordem cronológica, não armazenado."""

    __tablename__ = "dispute_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    dispute_id: Mapped[int] = mapped_column(ForeignKey("disputes.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    detail: Mapped[str | None] = mapped_column(String(1000))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    dispute: Mapped["Dispute"] = relationship(back_populates="events")
