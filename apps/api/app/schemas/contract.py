from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from pydantic import BaseModel, ConfigDict

from app.models.enums import EscrowStatusEnum, ServiceStatusEnum

if TYPE_CHECKING:
    from app.models.contract import Contract


class ContractOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contract_code: str
    event_id: int
    event_name: str
    event_city: str | None
    contratante_id: int
    contratante_name: str
    provider_id: int
    provider_name: str
    provider_avatar: str | None
    value: Decimal
    installments_count: int
    service_status: ServiceStatusEnum
    payment_status: EscrowStatusEnum
    created_at: datetime

    @classmethod
    def from_contract(cls, contract: "Contract") -> "ContractOut":
        return cls(
            id=contract.id,
            contract_code=contract.contract_code,
            event_id=contract.event_id,
            event_name=contract.event.name,
            event_city=contract.event.city,
            contratante_id=contract.contratante_id,
            contratante_name=contract.contratante.name,
            provider_id=contract.provider_id,
            provider_name=contract.provider.name,
            provider_avatar=contract.provider.avatar_url,
            value=contract.value,
            installments_count=contract.installments_count,
            service_status=contract.service_status,
            payment_status=contract.payment_status,
            created_at=contract.created_at,
        )
