from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import PayoutStatusEnum


class PayoutCreate(BaseModel):
    amount: Decimal
    pix_key: str | None = None


class PayoutOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    amount: Decimal
    method: str
    pix_key: str | None
    status: PayoutStatusEnum
    reference: str | None
    created_at: datetime
