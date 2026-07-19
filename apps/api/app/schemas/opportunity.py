from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import QuoteRequestStatusEnum


class OpportunityOut(BaseModel):
    """QuoteRequest do ponto de vista do fornecedor — um "lead" pra responder."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int | None
    event_name: str | None
    contratante_name: str
    category_name: str | None
    source: str
    budget: Decimal | None
    vision_text: str | None
    status: QuoteRequestStatusEnum
    created_at: datetime
    proposals_count: int
