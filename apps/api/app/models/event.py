from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Column, ForeignKey, Numeric, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import EventPhaseEnum, EventTypeEnum, VenueStatusEnum

event_service_categories = Table(
    "event_service_categories",
    Base.metadata,
    Column("event_id", ForeignKey("events.id"), primary_key=True),
    Column("category_id", ForeignKey("service_categories.id"), primary_key=True),
)


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    contratante_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    type: Mapped[EventTypeEnum] = mapped_column()
    name: Mapped[str] = mapped_column(String(200))
    event_date: Mapped[date | None]
    guests_count: Mapped[int | None]
    notes: Mapped[str | None] = mapped_column(String(2000))
    country: Mapped[str | None] = mapped_column(String(100))
    district: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100))
    venue_name: Mapped[str | None] = mapped_column(String(160))
    address: Mapped[str | None] = mapped_column(String(300))
    venue_status: Mapped[VenueStatusEnum | None] = mapped_column()
    phase: Mapped[EventPhaseEnum] = mapped_column(default=EventPhaseEnum.ONBOARDING)
    budget_total: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    contratante: Mapped["User"] = relationship()
    service_categories: Mapped[list["ServiceCategory"]] = relationship(
        secondary=event_service_categories
    )
