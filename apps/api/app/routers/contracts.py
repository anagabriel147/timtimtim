from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.contract import Contract
from app.models.enums import RoleEnum
from app.models.user import User
from app.schemas.contract import ContractOut

router = APIRouter(prefix="/contracts", tags=["contracts"])


def _owner_column(current_user: User):
    return (
        Contract.provider_id
        if current_user.role == RoleEnum.FORNECEDOR
        else Contract.contratante_id
    )


def _owns(contract: Contract, current_user: User) -> bool:
    if current_user.role == RoleEnum.FORNECEDOR:
        return contract.provider_id == current_user.id
    return contract.contratante_id == current_user.id


@router.get("", response_model=list[ContractOut])
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ContractOut]:
    contracts = (
        db.query(Contract)
        .filter(_owner_column(current_user) == current_user.id)
        .order_by(Contract.created_at.desc())
        .all()
    )
    return [ContractOut.from_contract(c) for c in contracts]


@router.get("/{contract_id}", response_model=ContractOut)
def get_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ContractOut:
    contract = db.get(Contract, contract_id)
    if contract is None or not _owns(contract, current_user):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Contrato não encontrado."
        )
    return ContractOut.from_contract(contract)
