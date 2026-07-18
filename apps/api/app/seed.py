"""Popula o banco com dados de teste: os 4 usuários que hoje estão
hardcoded no login mock do frontend (mesmas credenciais, agora com senha
hasheada de verdade), categorias de serviço, e um evento com uma proposta
pendente do fornecedor — o suficiente para o dashboard e o detalhe do
evento do contratante mostrarem dado real.

Uso: python -m app.seed
"""

from datetime import date, timedelta

from app.core.security import hash_password
from app.db import Base, SessionLocal, engine
from app.models.catalog import ServiceCategory
from app.models.enums import EventTypeEnum, ProposalStatusEnum, QuoteRequestStatusEnum, RoleEnum
from app.models.event import Event
from app.models.proposal import Proposal, ProposalItem, QuoteRequest
from app.models.user import AssessorProfile, ProviderProfile, User

SEED_USERS = [
    {
        "name": "Ana",
        "email": "ana@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.CONTRATANTE,
    },
    {
        "name": "Guto Decorações",
        "email": "fornecedor@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.FORNECEDOR,
    },
    {
        "name": "Isabela Assessora",
        "email": "assessor@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.ASSESSOR,
    },
    {
        "name": "Admin TimTim",
        "email": "admin@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.ADMIN,
    },
]

SEED_CATEGORIES = [
    {"name": "Bar de Coquetéis", "slug": "bar", "icon": "martini"},
    {"name": "Buffet / Gastronomia", "slug": "buffet", "icon": "utensils"},
    {"name": "DJs & Sonorização", "slug": "dj", "icon": "disc"},
    {"name": "Decoração & Cenografia", "slug": "decoracao", "icon": "flower"},
    {"name": "Fotografia & Filme", "slug": "fotografia", "icon": "camera"},
    {"name": "Banda / Música ao Vivo", "slug": "banda", "icon": "music"},
]


def seed() -> None:
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        users_by_email = {}
        for data in SEED_USERS:
            existing = db.query(User).filter(User.email == data["email"]).first()
            if existing:
                print(f"[skip] {data['email']} já existe")
                users_by_email[data["email"]] = existing
                continue

            user = User(
                name=data["name"],
                email=data["email"],
                password_hash=hash_password(data["password"]),
                role=data["role"],
            )
            db.add(user)
            db.flush()
            users_by_email[data["email"]] = user

            if data["role"] == RoleEnum.FORNECEDOR:
                db.add(ProviderProfile(user_id=user.id))
            elif data["role"] == RoleEnum.ASSESSOR:
                db.add(AssessorProfile(user_id=user.id, referral_code="ISABELA-TT25"))

            print(f"[criado] {data['email']} ({data['role'].value})")

        db.commit()

        categories_by_slug = {}
        for cat in SEED_CATEGORIES:
            existing = db.query(ServiceCategory).filter(ServiceCategory.slug == cat["slug"]).first()
            if existing:
                categories_by_slug[cat["slug"]] = existing
                continue
            category = ServiceCategory(**cat)
            db.add(category)
            db.flush()
            categories_by_slug[cat["slug"]] = category
            print(f"[criado] categoria {cat['name']}")
        db.commit()

        contratante = users_by_email["ana@timtim.com.br"]
        provider = users_by_email["fornecedor@timtim.com.br"]

        existing_event = (
            db.query(Event)
            .filter(Event.contratante_id == contratante.id, Event.name == "Casamento da Ana & Pedro")
            .first()
        )
        if existing_event is None:
            event = Event(
                contratante_id=contratante.id,
                type=EventTypeEnum.CASAMENTO,
                name="Casamento da Ana & Pedro",
                event_date=date.today() + timedelta(days=180),
                guests_count=120,
                country="Brasil",
                city="São Paulo",
                venue_name="Salão Jardim das Flores",
                service_categories=[categories_by_slug["decoracao"], categories_by_slug["buffet"]],
            )
            db.add(event)
            db.flush()

            quote_request = QuoteRequest(
                event_id=event.id,
                contratante_id=contratante.id,
                provider_id=provider.id,
                category_id=categories_by_slug["decoracao"].id,
                source="marketplace",
                status=QuoteRequestStatusEnum.RESPONDIDO,
            )
            db.add(quote_request)
            db.flush()

            proposal = Proposal(
                quote_request_id=quote_request.id,
                provider_id=provider.id,
                title="Decoração completa do salão",
                category_id=categories_by_slug["decoracao"].id,
                deadline=date.today() + timedelta(days=170),
                amount=16500,
                payment_term="3x sem juros",
                validity_days=7,
                scope_text="Decoração completa do salão de festas, incluindo arranjos florais, "
                "iluminação cênica e cenografia para a cerimônia e recepção.",
                status=ProposalStatusEnum.ANALISE,
            )
            db.add(proposal)
            db.flush()
            db.add(
                ProposalItem(
                    proposal_id=proposal.id,
                    description="Arranjos florais (mesa principal + 12 mesas)",
                    qty=1,
                    unit="pacote",
                    unit_value=9000,
                )
            )
            db.add(
                ProposalItem(
                    proposal_id=proposal.id,
                    description="Iluminação cênica e cenografia",
                    qty=1,
                    unit="pacote",
                    unit_value=7500,
                )
            )
            db.commit()
            print("[criado] evento + proposta pendente para Ana")
        else:
            print("[skip] evento seed já existe")

        # eventos já concluídos, para o histórico do dashboard
        for name, days_ago in [("Festa de Noivado", 400), ("Aniversário de 30 Anos", 550)]:
            if db.query(Event).filter(Event.contratante_id == contratante.id, Event.name == name).first():
                continue
            db.add(
                Event(
                    contratante_id=contratante.id,
                    type=EventTypeEnum.OUTRO,
                    name=name,
                    event_date=date.today() - timedelta(days=days_ago),
                    city="Rio de Janeiro",
                )
            )
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
