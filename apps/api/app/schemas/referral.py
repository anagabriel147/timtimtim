from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import CommissionStatusEnum


class ReferralOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_name: str
    contratante_name: str
    provider_id: int
    provider_name: str
    category_name: str | None
    contract_value: Decimal
    commission_amount: Decimal
    commission_percent: Decimal
    status: CommissionStatusEnum
    created_at: datetime


class ReferralSummaryOut(BaseModel):
    referral_code: str
    referred_providers: int
    confirmed_referrals: int
    conversion_rate: float
    contracts_volume: Decimal
    total_commissions: Decimal
    commissions_this_month: Decimal
    average_per_referral: Decimal


class TopVendorOut(BaseModel):
    provider_id: int
    provider_name: str
    total_commission: Decimal
    percent: float


class CommissionMonthOut(BaseModel):
    month: str
    total: Decimal
