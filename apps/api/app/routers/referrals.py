from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.enums import CommissionStatusEnum, RoleEnum
from app.models.payout import Commission
from app.models.user import AssessorProfile, ProviderProfile, User
from app.schemas.referral import (
    CommissionMonthOut,
    ReferralOut,
    ReferralSummaryOut,
    TopVendorOut,
)

router = APIRouter(prefix="/referrals", tags=["referrals"])

EARNED_STATUSES = (CommissionStatusEnum.CONFIRMADA, CommissionStatusEnum.PAGA)


def _require_assessor(current_user: User) -> None:
    if current_user.role != RoleEnum.ASSESSOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas assessores têm indicações.",
        )


def _referral_out(commission: Commission) -> ReferralOut:
    contract = commission.contract
    proposal = contract.proposal
    return ReferralOut(
        id=commission.id,
        event_name=contract.event.name,
        contratante_name=contract.contratante.name,
        provider_id=commission.provider_id,
        provider_name=contract.provider.name,
        category_name=proposal.category.name if proposal.category else None,
        contract_value=contract.value,
        commission_amount=commission.amount,
        commission_percent=commission.percent,
        status=commission.status,
        created_at=commission.created_at,
    )


@router.get("", response_model=list[ReferralOut])
def list_referrals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ReferralOut]:
    _require_assessor(current_user)
    commissions = (
        db.query(Commission)
        .filter(Commission.assessor_id == current_user.id)
        .order_by(Commission.created_at.desc())
        .all()
    )
    return [_referral_out(c) for c in commissions]


@router.get("/summary", response_model=ReferralSummaryOut)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReferralSummaryOut:
    _require_assessor(current_user)

    profile = db.get(AssessorProfile, current_user.id)
    referral_code = profile.referral_code if profile else ""

    referred_providers = (
        db.query(ProviderProfile)
        .filter(ProviderProfile.referred_by_assessor_id == current_user.id)
        .count()
    )

    commissions = (
        db.query(Commission).filter(Commission.assessor_id == current_user.id).all()
    )
    earned = [c for c in commissions if c.status in EARNED_STATUSES]
    confirmed_provider_ids = {c.provider_id for c in earned}

    now = datetime.utcnow()
    commissions_this_month = sum(
        (c.amount for c in earned if c.created_at.year == now.year and c.created_at.month == now.month),
        start=0,
    )
    total_commissions = sum((c.amount for c in earned), start=0)
    contracts_volume = sum((c.contract.value for c in earned), start=0)
    average_per_referral = total_commissions / len(earned) if earned else 0
    conversion_rate = (
        len(confirmed_provider_ids) / referred_providers * 100 if referred_providers else 0.0
    )

    return ReferralSummaryOut(
        referral_code=referral_code,
        referred_providers=referred_providers,
        confirmed_referrals=len(confirmed_provider_ids),
        conversion_rate=round(conversion_rate, 1),
        contracts_volume=contracts_volume,
        total_commissions=total_commissions,
        commissions_this_month=commissions_this_month,
        average_per_referral=average_per_referral,
    )


@router.get("/top-providers", response_model=list[TopVendorOut])
def top_providers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TopVendorOut]:
    _require_assessor(current_user)
    commissions = (
        db.query(Commission)
        .filter(
            Commission.assessor_id == current_user.id,
            Commission.status.in_(EARNED_STATUSES),
        )
        .all()
    )

    totals: dict[int, dict] = {}
    for c in commissions:
        entry = totals.setdefault(
            c.provider_id, {"provider_id": c.provider_id, "name": c.contract.provider.name, "total": 0}
        )
        entry["total"] += c.amount

    ranked = sorted(totals.values(), key=lambda e: e["total"], reverse=True)[:5]
    top_amount = ranked[0]["total"] if ranked else 0
    return [
        TopVendorOut(
            provider_id=entry["provider_id"],
            provider_name=entry["name"],
            total_commission=entry["total"],
            percent=round(float(entry["total"] / top_amount * 100), 0) if top_amount else 0.0,
        )
        for entry in ranked
    ]


@router.get("/commission-trend", response_model=list[CommissionMonthOut])
def commission_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[CommissionMonthOut]:
    _require_assessor(current_user)
    commissions = (
        db.query(Commission)
        .filter(
            Commission.assessor_id == current_user.id,
            Commission.status.in_(EARNED_STATUSES),
        )
        .all()
    )

    # últimos 6 meses (incluindo o atual), com zero para meses sem comissão
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

    totals = {key: 0 for key in months}
    for c in commissions:
        key = (c.created_at.year, c.created_at.month)
        if key in totals:
            totals[key] += c.amount

    return [
        CommissionMonthOut(month=f"{y:04d}-{m:02d}", total=totals[(y, m)]) for (y, m) in months
    ]
