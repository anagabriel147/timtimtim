from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import DisputeSeverityEnum, DisputeStatusEnum


class AdminKpisOut(BaseModel):
    active_subscribers: int
    mrr: Decimal
    referral_commissions_paid: Decimal
    gross_volume: Decimal


class AdminDisputeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contract_code: str
    severity: DisputeSeverityEnum
    status: DisputeStatusEnum
    opened_by_name: str
    respondent_name: str
    dispute_value: Decimal | None
    description: str
    deadline_at: datetime | None
    events_count: int
    created_at: datetime


class EcosystemActivityMonthOut(BaseModel):
    month: str
    events_count: int


class PlatformHealthOut(BaseModel):
    conversion_rate: float
    avg_rating: float | None
    contracts_completed_rate: float
    disputes_resolved_rate: float


class AdminTopVendorOut(BaseModel):
    provider_id: int
    provider_name: str
    category_name: str | None
    total_revenue: Decimal
    avg_rating: float | None
