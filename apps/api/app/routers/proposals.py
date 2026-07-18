from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.contract import Contract
from app.models.enums import EscrowStatusEnum, ProposalStatusEnum, ServiceStatusEnum
from app.models.proposal import Proposal, QuoteRequest
from app.models.user import User
from app.schemas.contract import ContractOut
from app.schemas.proposal import ProposalOut

router = APIRouter(prefix="/proposals", tags=["proposals"])


def _proposal_out(proposal: Proposal) -> ProposalOut:
    return ProposalOut(
        id=proposal.id,
        quote_request_id=proposal.quote_request_id,
        provider_id=proposal.provider_id,
        provider_name=proposal.provider.name,
        provider_avatar=proposal.provider.avatar_url,
        title=proposal.title,
        amount=proposal.amount,
        payment_term=proposal.payment_term,
        validity_days=proposal.validity_days,
        scope_text=proposal.scope_text,
        status=proposal.status,
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
