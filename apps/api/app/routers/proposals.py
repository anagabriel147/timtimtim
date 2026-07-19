from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.contract import Contract
from app.models.enums import (
    EscrowStatusEnum,
    ProposalStatusEnum,
    QuoteRequestStatusEnum,
    RoleEnum,
    ServiceStatusEnum,
)
from app.models.proposal import Proposal, ProposalItem, QuoteRequest
from app.models.user import User
from app.schemas.contract import ContractOut
from app.schemas.proposal import ProposalCreate, ProposalOut

router = APIRouter(prefix="/proposals", tags=["proposals"])


def _proposal_out(proposal: Proposal) -> ProposalOut:
    return ProposalOut(
        id=proposal.id,
        quote_request_id=proposal.quote_request_id,
        provider_id=proposal.provider_id,
        provider_name=proposal.provider.name,
        provider_avatar=proposal.provider.avatar_url,
        contratante_name=proposal.quote_request.contratante.name,
        event_name=proposal.quote_request.event.name if proposal.quote_request.event else None,
        category_name=proposal.category.name if proposal.category else None,
        title=proposal.title,
        amount=proposal.amount,
        payment_term=proposal.payment_term,
        validity_days=proposal.validity_days,
        scope_text=proposal.scope_text,
        status=proposal.status,
        created_at=proposal.created_at,
        items=list(proposal.items),
    )


def _get_owned_proposal(db: Session, proposal_id: int, current_user: User) -> Proposal:
    proposal = db.get(Proposal, proposal_id)
    if proposal is None or proposal.quote_request.contratante_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposta não encontrada."
        )
    return proposal


@router.get("", response_model=list[ProposalOut])
def list_proposals(
    event_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ProposalOut]:
    proposals = (
        db.query(Proposal)
        .join(QuoteRequest, Proposal.quote_request_id == QuoteRequest.id)
        .filter(
            QuoteRequest.event_id == event_id,
            QuoteRequest.contratante_id == current_user.id,
        )
        .all()
    )
    return [_proposal_out(p) for p in proposals]


@router.get("/mine", response_model=list[ProposalOut])
def list_my_proposals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ProposalOut]:
    if current_user.role != RoleEnum.FORNECEDOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Apenas fornecedores têm propostas enviadas."
        )
    proposals = (
        db.query(Proposal)
        .filter(Proposal.provider_id == current_user.id)
        .order_by(Proposal.created_at.desc())
        .all()
    )
    return [_proposal_out(p) for p in proposals]


@router.post("", response_model=ProposalOut, status_code=status.HTTP_201_CREATED)
def create_proposal(
    payload: ProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProposalOut:
    if current_user.role != RoleEnum.FORNECEDOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Apenas fornecedores enviam propostas."
        )

    quote_request = db.get(QuoteRequest, payload.quote_request_id)
    if quote_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Solicitação de orçamento não encontrada."
        )
    if quote_request.provider_id is not None and quote_request.provider_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta solicitação é direcionada a outro fornecedor.",
        )

    existing = (
        db.query(Proposal)
        .filter(
            Proposal.quote_request_id == quote_request.id,
            Proposal.provider_id == current_user.id,
        )
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Você já enviou uma proposta para esta solicitação.",
        )

    proposal = Proposal(
        quote_request_id=quote_request.id,
        provider_id=current_user.id,
        title=payload.title,
        category_id=payload.category_id,
        deadline=payload.deadline,
        amount=payload.amount,
        payment_term=payload.payment_term,
        validity_days=payload.validity_days,
        scope_text=payload.scope_text,
        notes=payload.notes,
    )
    db.add(proposal)
    db.flush()

    for item in payload.items:
        db.add(
            ProposalItem(
                proposal_id=proposal.id,
                description=item.description,
                qty=item.qty,
                unit=item.unit,
                unit_value=item.unit_value,
            )
        )

    if quote_request.provider_id is not None:
        # solicitação direcionada: já foi respondida, não há concorrência
        quote_request.status = QuoteRequestStatusEnum.RESPONDIDO
    # solicitações em broadcast (provider_id nulo) continuam ABERTO para que
    # outros fornecedores da categoria também possam enviar propostas — o
    # fechamento só acontece quando o contratante aceita uma delas
    db.commit()
    db.refresh(proposal)
    return _proposal_out(proposal)


@router.post("/{proposal_id}/accept", response_model=ContractOut)
def accept_proposal(
    proposal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Contract:
    proposal = _get_owned_proposal(db, proposal_id, current_user)
    if proposal.status in (ProposalStatusEnum.CONTRATO, ProposalStatusEnum.FINALIZADA):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Proposta já tem contrato."
        )

    existing = db.query(Contract).filter(Contract.proposal_id == proposal.id).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Proposta já tem contrato."
        )

    quote_request = proposal.quote_request
    contract = Contract(
        proposal_id=proposal.id,
        contratante_id=current_user.id,
        provider_id=proposal.provider_id,
        event_id=quote_request.event_id,
        contract_code="",  # preenchido abaixo, depois que o id real existe
        value=proposal.amount,
        service_status=ServiceStatusEnum.CONFIRMADO,
        payment_status=EscrowStatusEnum.GARANTIDO,
    )
    proposal.status = ProposalStatusEnum.CONTRATO
    quote_request.status = QuoteRequestStatusEnum.RESPONDIDO
    db.add(contract)
    db.flush()  # gera contract.id (PK autoincrement) sem correr risco de colisão
    contract.contract_code = f"TT-{datetime.utcnow().year}-{contract.id:04d}"
    db.commit()
    db.refresh(contract)

    return ContractOut.from_contract(contract)


@router.post("/{proposal_id}/reject", response_model=ProposalOut)
def reject_proposal(
    proposal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProposalOut:
    proposal = _get_owned_proposal(db, proposal_id, current_user)
    proposal.status = ProposalStatusEnum.RECUSADA
    db.commit()
    db.refresh(proposal)
    return _proposal_out(proposal)
