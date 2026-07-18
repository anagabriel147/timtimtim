from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.contract import Contract
from app.models.dispute import Dispute
from app.models.user import User
from app.schemas.dispute import DisputeCreate, DisputeOut

router = APIRouter(prefix="/disputes", tags=["disputes"])


@router.post("", response_model=DisputeOut, status_code=status.HTTP_201_CREATED)
def create_dispute(
    payload: DisputeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dispute:
    contract = db.get(Contract, payload.contract_id)
    if contract is None or contract.contratante_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Contrato não encontrado."
        )

    dispute = Dispute(
        contract_id=contract.id,
        opened_by_user_id=current_user.id,
        respondent_user_id=contract.provider_id,
        category=payload.category,
        severity=payload.severity,
        incident_date=payload.incident_date,
        statement_text=payload.statement_text,
        requested_resolution=payload.requested_resolution,
        requested_value=payload.requested_value,
    )
    db.add(dispute)
    db.commit()
    db.refresh(dispute)
    return dispute
