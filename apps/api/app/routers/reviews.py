from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.contract import Contract
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Review:
    contract = db.get(Contract, payload.contract_id)
    if contract is None or contract.contratante_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Contrato não encontrado."
        )

    existing = db.query(Review).filter(Review.contract_id == contract.id).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Este contrato já foi avaliado."
        )

    review = Review(
        contract_id=contract.id,
        reviewer_id=current_user.id,
        provider_id=contract.provider_id,
        rating_overall=payload.rating_overall,
        rating_atendimento=payload.rating_atendimento,
        rating_pontualidade=payload.rating_pontualidade,
        rating_qualidade=payload.rating_qualidade,
        highlights=payload.highlights,
        text=payload.text,
        recommend=payload.recommend,
        show_name=payload.show_name,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
