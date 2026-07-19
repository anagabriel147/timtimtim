"""Fixtures compartilhadas. Cada teste roda contra um banco SQLite dedicado
(test.db), recriado do zero antes de cada teste — sem relação nenhuma com o
timtim.db de desenvolvimento nem com app.seed."""

import os

# Precisa ser setado ANTES de importar qualquer módulo de app.* — db.py lê
# DATABASE_URL uma vez, no import, pra construir o engine.
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-production")

from decimal import Decimal  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from app.core.security import create_access_token, hash_password  # noqa: E402
from app.db import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models.catalog import ServiceCategory  # noqa: E402
from app.models.contract import Contract  # noqa: E402
from app.models.billing import Plan, Subscription  # noqa: E402
from app.models.enums import (  # noqa: E402
    BillingCycleEnum,
    CommissionStatusEnum,
    EscrowStatusEnum,
    EventTypeEnum,
    PlanRoleEnum,
    ProposalStatusEnum,
    QuoteRequestStatusEnum,
    RoleEnum,
    ServiceStatusEnum,
    SubscriptionStatusEnum,
)
from app.models.event import Event  # noqa: E402
from app.models.payout import Commission  # noqa: E402
from app.models.proposal import Proposal, QuoteRequest  # noqa: E402
from app.models.review import Review  # noqa: E402
from app.models.user import AssessorProfile, ProviderProfile, User  # noqa: E402


@pytest.fixture(autouse=True)
def _fresh_schema():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def db() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as c:
        yield c


_user_seq = iter(range(1, 100_000))


@pytest.fixture
def make_user(db: Session):
    def _make(
        role: RoleEnum,
        email: str | None = None,
        name: str = "Usuário Teste",
        password: str = "senha123",
        is_active: bool = True,
    ) -> User:
        email = email or f"user{next(_user_seq)}@example.com"
        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role=role,
            is_active=is_active,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    return _make


@pytest.fixture
def auth_headers():
    def _headers(user: User) -> dict[str, str]:
        token = create_access_token(subject=str(user.id))
        return {"Authorization": f"Bearer {token}"}

    return _headers


@pytest.fixture
def make_category(db: Session):
    def _make(name: str = "Decoração & Cenografia", slug: str = "decoracao") -> ServiceCategory:
        category = ServiceCategory(name=name, slug=slug, icon="flower")
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    return _make


@pytest.fixture
def make_provider_profile(db: Session):
    def _make(
        user: User,
        category: ServiceCategory | None = None,
        referred_by: User | None = None,
    ) -> ProviderProfile:
        profile = ProviderProfile(
            user_id=user.id,
            company_name=user.name,
            category_id=category.id if category else None,
            referred_by_assessor_id=referred_by.id if referred_by else None,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    return _make


@pytest.fixture
def make_assessor_profile(db: Session):
    def _make(user: User, referral_code: str | None = None) -> AssessorProfile:
        profile = AssessorProfile(
            user_id=user.id, referral_code=referral_code or f"REF-{user.id}"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    return _make


@pytest.fixture
def make_event(db: Session):
    def _make(contratante: User, name: str = "Evento Teste") -> Event:
        event = Event(contratante_id=contratante.id, type=EventTypeEnum.CASAMENTO, name=name)
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    return _make


@pytest.fixture
def make_quote_request(db: Session):
    def _make(
        contratante: User,
        event: Event | None = None,
        provider: User | None = None,
        category: ServiceCategory | None = None,
        status: QuoteRequestStatusEnum = QuoteRequestStatusEnum.ABERTO,
        source: str = "marketplace",
    ) -> QuoteRequest:
        qr = QuoteRequest(
            event_id=event.id if event else None,
            contratante_id=contratante.id,
            provider_id=provider.id if provider else None,
            category_id=category.id if category else None,
            source=source,
            status=status,
        )
        db.add(qr)
        db.commit()
        db.refresh(qr)
        return qr

    return _make


@pytest.fixture
def make_proposal(db: Session):
    def _make(
        quote_request: QuoteRequest,
        provider: User,
        amount: Decimal = Decimal("1000.00"),
        status: ProposalStatusEnum = ProposalStatusEnum.ANALISE,
        title: str = "Proposta Teste",
    ) -> Proposal:
        proposal = Proposal(
            quote_request_id=quote_request.id,
            provider_id=provider.id,
            title=title,
            amount=amount,
            status=status,
        )
        db.add(proposal)
        db.commit()
        db.refresh(proposal)
        return proposal

    return _make


@pytest.fixture
def make_contract(db: Session):
    def _make(
        proposal: Proposal,
        contratante: User,
        provider: User,
        event: Event,
        value: Decimal = Decimal("1000.00"),
        service_status: ServiceStatusEnum = ServiceStatusEnum.CONFIRMADO,
        payment_status: EscrowStatusEnum = EscrowStatusEnum.GARANTIDO,
        contract_code: str | None = None,
    ) -> Contract:
        contract = Contract(
            proposal_id=proposal.id,
            contratante_id=contratante.id,
            provider_id=provider.id,
            event_id=event.id,
            contract_code=contract_code or f"TT-TEST-{proposal.id:04d}",
            value=value,
            service_status=service_status,
            payment_status=payment_status,
        )
        db.add(contract)
        db.commit()
        db.refresh(contract)
        return contract

    return _make


@pytest.fixture
def make_commission(db: Session):
    def _make(
        assessor: User,
        contract: Contract,
        amount: Decimal = Decimal("100.00"),
        percent: Decimal = Decimal("5.00"),
        status: CommissionStatusEnum = CommissionStatusEnum.CONFIRMADA,
    ):
        commission = Commission(
            assessor_id=assessor.id,
            contract_id=contract.id,
            provider_id=contract.provider_id,
            amount=amount,
            percent=percent,
            status=status,
        )
        db.add(commission)
        db.commit()
        db.refresh(commission)
        return commission

    return _make


@pytest.fixture
def make_plan(db: Session):
    def _make(
        role: PlanRoleEnum = PlanRoleEnum.FORNECEDOR,
        name: str = "Fornecedor Pro",
        billing_cycle: BillingCycleEnum = BillingCycleEnum.MENSAL,
        price_cents: int = 9900,
    ) -> Plan:
        plan = Plan(role=role, name=name, billing_cycle=billing_cycle, price_cents=price_cents)
        db.add(plan)
        db.commit()
        db.refresh(plan)
        return plan

    return _make


@pytest.fixture
def make_subscription(db: Session):
    def _make(
        user: User,
        plan: Plan,
        status: SubscriptionStatusEnum = SubscriptionStatusEnum.ATIVA,
    ) -> Subscription:
        sub = Subscription(user_id=user.id, plan_id=plan.id, status=status)
        db.add(sub)
        db.commit()
        db.refresh(sub)
        return sub

    return _make


@pytest.fixture
def make_review(db: Session):
    def _make(contract: Contract, reviewer: User, rating_overall: int = 5) -> Review:
        review = Review(
            contract_id=contract.id,
            reviewer_id=reviewer.id,
            provider_id=contract.provider_id,
            rating_overall=rating_overall,
            rating_atendimento=rating_overall,
            rating_pontualidade=rating_overall,
            rating_qualidade=rating_overall,
            text="Ótimo!",
            recommend=True,
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        return review

    return _make
