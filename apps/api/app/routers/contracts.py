from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.contract import Contract
from app.models.user import User
from app.schemas.contract import ContractOut

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.get("", response_model=list[ContractOut])
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ContractOut]:
    contracts = (
        db.query(Contract)
        .filter(Contract.contratante_id == current_user.id)
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
    if contract is None or contract.contratante_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Contrato não encontrado."
        )
    return ContractOut.from_contract(contract)
