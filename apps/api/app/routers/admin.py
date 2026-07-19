from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.billing import Subscription
from app.models.contract import Contract
from app.models.dispute import Dispute
from app.models.enums import (
    BillingCycleEnum,
    CommissionStatusEnum,
    DisputeStatusEnum,
    RoleEnum,
    ServiceStatusEnum,
    SubscriptionStatusEnum,
)
from app.models.event import Event
from app.models.payout import Commission
from app.models.proposal import QuoteRequest
from app.models.review import Review
from app.models.user import ProviderProfile, User
from app.schemas.admin import (
    AdminDisputeOut,
    AdminKpisOut,
    AdminTopVendorOut,
    EcosystemActivityMonthOut,
    PlatformHealthOut,
)

router = APIRouter(prefix="/admin", tags=["admin"])

ACTIVE_SUBSCRIPTION_STATUSES = (SubscriptionStatusEnum.ATIVA, SubscriptionStatusEnum.TRIAL)
EARNED_COMMISSION_STATUSES = (CommissionStatusEnum.CONFIRMADA, CommissionStatusEnum.PAGA)
OPEN_DISPUTE_STATUSES = (DisputeStatusEnum.ABERTA, DisputeStatusEnum.EM_ANALISE)


def _require_admin(current_user: User) -> None:
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores têm acesso a este painel.",
        )


@router.get("/kpis", response_model=AdminKpisOut)
def get_kpis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AdminKpisOut:
    _require_admin(current_user)

    active_subs = (
        db.query(Subscription)
        .filter(Subscription.status.in_(ACTIVE_SUBSCRIPTION_STATUSES))
        .all()
    )
    active_subscribers = len(active_subs)

    paying_subs = [sub for sub in active_subs if sub.status == SubscriptionStatusEnum.ATIVA]
    mrr = sum(
        (
            (
                sub.plan.price_cents / 100 / 12
                if sub.plan.billing_cycle == BillingCycleEnum.ANUAL
                else sub.plan.price_cents / 100
            )
            for sub in paying_subs
        ),
        start=0,
    )

    commissions = db.query(Commission).all()
    referral_commissions_paid = sum(
        (c.amount for c in commissions if c.status in EARNED_COMMISSION_STATUSES),
        start=0,
    )

    gross_volume = sum((c.value for c in db.query(Contract).all()), start=0)

    return AdminKpisOut(
        active_subscribers=active_subscribers,
        mrr=mrr,
        referral_commissions_paid=referral_commissions_paid,
        gross_volume=gross_volume,
    )


@router.get("/disputes", response_model=list[AdminDisputeOut])
def list_open_disputes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AdminDisputeOut]:
    _require_admin(current_user)

    disputes = (
        db.query(Dispute)
        .filter(Dispute.status.in_(OPEN_DISPUTE_STATUSES))
        .order_by(Dispute.created_at.desc())
        .all()
    )
    return [
        AdminDisputeOut(
            id=d.id,
            contract_code=d.contract.contract_code,
            severity=d.severity,
            status=d.status,
            opened_by_name=d.opened_by.name,
            respondent_name=d.respondent.name,
            dispute_value=d.requested_value,
            description=d.statement_text,
            deadline_at=d.deadline_at,
            events_count=len(d.events),
            created_at=d.created_at,
        )
        for d in disputes
    ]


@router.get("/ecosystem-activity", response_model=list[EcosystemActivityMonthOut])
def ecosystem_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[EcosystemActivityMonthOut]:
    _require_admin(current_user)

    events = db.query(Event).all()

    now = datetime.utcnow()
    months: list[tuple[int, int]] = []
    y, m = now.year, now.month
    for _ in range(6):
        months.append((y, m))
        m -= 1
        if m == 0:
            m = 12
            y -= 1
    months.reverse()

    counts = {key: 0 for key in months}
    for e in events:
        key = (e.created_at.year, e.created_at.month)
        if key in counts:
            counts[key] += 1

    return [
        EcosystemActivityMonthOut(month=f"{y:04d}-{m:02d}", events_count=counts[(y, m)])
        for (y, m) in months
    ]


@router.get("/platform-health", response_model=PlatformHealthOut)
def platform_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PlatformHealthOut:
    _require_admin(current_user)

    quote_requests_count = db.query(QuoteRequest).count()
    contracts_count = db.query(Contract).count()
    conversion_rate = (
        round(contracts_count / quote_requests_count * 100, 1) if quote_requests_count else 0.0
    )

    ratings = [r.rating_overall for r in db.query(Review).all()]
    avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else None

    contracts = db.query(Contract).all()
    completed = sum(1 for c in contracts if c.service_status == ServiceStatusEnum.CONCLUIDO)
    contracts_completed_rate = round(completed / len(contracts) * 100, 1) if contracts else 0.0

    all_disputes = db.query(Dispute).all()
    resolved = sum(1 for d in all_disputes if d.status == DisputeStatusEnum.RESOLVIDA)
    disputes_resolved_rate = (
        round(resolved / len(all_disputes) * 100, 1) if all_disputes else 0.0
    )

    return PlatformHealthOut(
        conversion_rate=conversion_rate,
        avg_rating=avg_rating,
        contracts_completed_rate=contracts_completed_rate,
        disputes_resolved_rate=disputes_resolved_rate,
    )


@router.get("/top-vendors", response_model=list[AdminTopVendorOut])
def top_vendors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AdminTopVendorOut]:
    _require_admin(current_user)

    contracts = db.query(Contract).all()
    totals: dict[int, dict] = {}
    for c in contracts:
        entry = totals.setdefault(
            c.provider_id, {"provider_id": c.provider_id, "name": c.provider.name, "total": 0}
        )
        entry["total"] += c.value

    ranked = sorted(totals.values(), key=lambda e: e["total"], reverse=True)[:5]

    result = []
    for entry in ranked:
        profile = db.get(ProviderProfile, entry["provider_id"])
        category_name = profile.category.name if profile and profile.category else None

        ratings = [
            r.rating_overall
            for r in db.query(Review).filter(Review.provider_id == entry["provider_id"]).all()
        ]
        avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else None

        result.append(
            AdminTopVendorOut(
                provider_id=entry["provider_id"],
                provider_name=entry["name"],
                category_name=category_name,
                total_revenue=entry["total"],
                avg_rating=avg_rating,
            )
        )
    return result
