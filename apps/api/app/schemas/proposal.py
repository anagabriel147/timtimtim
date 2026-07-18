from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import ProposalStatusEnum


class ProposalItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    description: str
    qty: int
    unit: str | None
    unit_value: Decimal


class ProposalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quote_request_id: int
    provider_id: int
    provider_name: str
    provider_avatar: str | None
    title: str
    amount: Decimal
    payment_term: str | None
    validity_days: int | None
    scope_text: str | None
    status: ProposalStatusEnum
    items: list[ProposalItemOut] = []
