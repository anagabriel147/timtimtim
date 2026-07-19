from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.enums import PayoutStatusEnum, RoleEnum
from app.models.payout import ProviderPayout
from app.models.user import User
from app.schemas.payout import PayoutCreate, PayoutOut

router = APIRouter(prefix="/payouts", tags=["payouts"])


def _require_provider(current_user: User) -> None:
    if current_user.role != RoleEnum.FORNECEDOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas fornecedores têm carteira.",
        )


@router.get("", response_model=list[PayoutOut])
def list_payouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ProviderPayout]:
    _require_provider(current_user)
    return (
        db.query(ProviderPayout)
        .filter(ProviderPayout.provider_id == current_user.id)
        .order_by(ProviderPayout.created_at.desc())
        .all()
    )


@router.post("", response_model=PayoutOut, status_code=status.HTTP_201_CREATED)
def request_payout(
    payload: PayoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProviderPayout:
    _require_provider(current_user)
    if payload.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Valor de saque inválido."
        )

    payout = ProviderPayout(
        provider_id=current_user.id,
        amount=payload.amount,
        method="pix",
        pix_key=payload.pix_key,
        status=PayoutStatusEnum.ANALISE,
        reference=f"PIX-{current_user.id}-{payload.amount}",
    )
    db.add(payout)
    db.commit()
    db.refresh(payout)
    return payout
