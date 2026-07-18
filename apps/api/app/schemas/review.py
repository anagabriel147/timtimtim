from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    contract_id: int
    rating_overall: int = Field(ge=1, le=5)
    rating_atendimento: int = Field(ge=1, le=5)
    rating_pontualidade: int = Field(ge=1, le=5)
    rating_qualidade: int = Field(ge=1, le=5)
    highlights: list[str] = []
    text: str
    recommend: bool
    show_name: bool = True


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contract_id: int
    rating_overall: int
    text: str
    recommend: bool
    created_at: datetime
