from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import (
    DisputeCategoryEnum,
    DisputeResolutionEnum,
    DisputeSeverityEnum,
    DisputeStatusEnum,
)


class DisputeCreate(BaseModel):
    contract_id: int
    category: DisputeCategoryEnum
    severity: DisputeSeverityEnum
    incident_date: date | None = None
    statement_text: str
    requested_resolution: DisputeResolutionEnum
    requested_value: Decimal | None = None


class DisputeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contract_id: int
    status: DisputeStatusEnum
    category: DisputeCategoryEnum
    severity: DisputeSeverityEnum
    statement_text: str
    requested_resolution: DisputeResolutionEnum
    requested_value: Decimal | None
    created_at: datetime
