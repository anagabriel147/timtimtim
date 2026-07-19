from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.enums import QuoteRequestStatusEnum, RoleEnum
from app.models.proposal import Proposal, QuoteRequest
from app.models.user import ProviderProfile, User
from app.schemas.opportunity import OpportunityOut

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


def _is_eligible(qr: QuoteRequest, current_user: User, category_id: int | None) -> bool:
    if qr.provider_id is not None:
        return qr.provider_id == current_user.id
    return category_id is not None and qr.category_id == category_id


def _opportunity_out(qr: QuoteRequest, proposals_count: int) -> OpportunityOut:
    return OpportunityOut(
        id=qr.id,
        event_id=qr.event_id,
        event_name=qr.event.name if qr.event else None,
        contratante_name=qr.contratante.name,
        category_name=qr.category.name if qr.category else None,
        source=qr.source,
        budget=qr.budget,
        vision_text=qr.vision_text,
        status=qr.status,
        created_at=qr.created_at,
        proposals_count=proposals_count,
    )


@router.get("", response_model=list[OpportunityOut])
def list_opportunities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[OpportunityOut]:
    if current_user.role != RoleEnum.FORNECEDOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas fornecedores têm oportunidades.",
        )

    profile = db.get(ProviderProfile, current_user.id)
    category_id = profile.category_id if profile else None

    already_answered = {
        p.quote_request_id
        for p in db.query(Proposal).filter(Proposal.provider_id == current_user.id).all()
    }

    query = db.query(QuoteRequest).filter(QuoteRequest.status == QuoteRequestStatusEnum.ABERTO)
    if category_id is not None:
        query = query.filter(
            or_(
                QuoteRequest.provider_id == current_user.id,
                QuoteRequest.category_id == category_id,
            )
        )
    else:
        query = query.filter(QuoteRequest.provider_id == current_user.id)

    opportunities = [qr for qr in query.all() if qr.id not in already_answered]

    # contagem simples de propostas por solicitação (poucas linhas, sem necessidade de agregação SQL)
    counts: dict[int, int] = {}
    for (qr_id,) in db.query(Proposal.quote_request_id).all():
        counts[qr_id] = counts.get(qr_id, 0) + 1

    return [_opportunity_out(qr, counts.get(qr.id, 0)) for qr in opportunities]


@router.get("/{opportunity_id}", response_model=OpportunityOut)
def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OpportunityOut:
    if current_user.role != RoleEnum.FORNECEDOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas fornecedores têm oportunidades.",
        )
    qr = db.get(QuoteRequest, opportunity_id)
    if qr is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Solicitação não encontrada."
        )

    profile = db.get(ProviderProfile, current_user.id)
    category_id = profile.category_id if profile else None
    if not _is_eligible(qr, current_user, category_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Solicitação não encontrada."
        )

    proposals_count = (
        db.query(Proposal).filter(Proposal.quote_request_id == qr.id).count()
    )
    return _opportunity_out(qr, proposals_count)
