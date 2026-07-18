from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import EventPhaseEnum, EventTypeEnum, VenueStatusEnum


class ServiceCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    icon: str | None = None


class EventCreate(BaseModel):
    type: EventTypeEnum
    name: str
    event_date: date | None = None
    guests_count: int | None = None
    notes: str | None = None
    country: str | None = None
    district: str | None = None
    city: str | None = None
    venue_name: str | None = None
    address: str | None = None
    venue_status: VenueStatusEnum | None = None
    service_category_ids: list[int] = []


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: EventTypeEnum
    name: str
    event_date: date | None
    guests_count: int | None
    notes: str | None
    country: str | None
    district: str | None
    city: str | None
    venue_name: str | None
    address: str | None
    venue_status: VenueStatusEnum | None
    phase: EventPhaseEnum
    budget_total: Decimal | None
    created_at: datetime
    service_categories: list[ServiceCategoryOut] = []
