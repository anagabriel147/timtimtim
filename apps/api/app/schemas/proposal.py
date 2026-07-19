from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import ProposalStatusEnum


class ProposalItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    description: str
    qty: int
    unit: str | None
    unit_value: Decimal


class ProposalItemIn(BaseModel):
    description: str
    qty: int = 1
    unit: str | None = None
    unit_value: Decimal


class ProposalCreate(BaseModel):
    quote_request_id: int
    title: str
    category_id: int | None = None
    deadline: date | None = None
    amount: Decimal
    payment_term: str | None = None
    validity_days: int | None = None
    scope_text: str | None = None
    notes: str | None = None
    items: list[ProposalItemIn] = []


class ProposalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quote_request_id: int
    provider_id: int
    provider_name: str
    provider_avatar: str | None
    contratante_name: str
    event_name: str | None
    category_name: str | None
    title: str
    amount: Decimal
    payment_term: str | None
    validity_days: int | None
    scope_text: str | None
    status: ProposalStatusEnum
    created_at: datetime
    items: list[ProposalItemOut] = []
