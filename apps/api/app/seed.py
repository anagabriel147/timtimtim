"""Popula o banco com dados de teste: os 4 usuários que hoje estão
hardcoded no login mock do frontend (mesmas credenciais, agora com senha
hasheada de verdade), categorias de serviço, um evento com uma proposta
pendente do fornecedor (já virou contrato ao longo dos testes manuais) e
uma segunda solicitação de orçamento ainda aberta — o suficiente para os
dashboards do contratante e do fornecedor mostrarem dado real.

Uso: python -m app.seed
"""

from datetime import date, timedelta
from decimal import Decimal

from app.core.security import hash_password
from app.db import Base, SessionLocal, engine
from app.models.catalog import ServiceCategory
from app.models.contract import Contract
from app.models.enums import (
    CommissionStatusEnum,
    EscrowStatusEnum,
    EventTypeEnum,
    ProposalStatusEnum,
    QuoteRequestStatusEnum,
    RoleEnum,
    ServiceStatusEnum,
)
from app.models.event import Event
from app.models.payout import Commission
from app.models.proposal import Proposal, ProposalItem, QuoteRequest
from app.models.user import AssessorProfile, ProviderProfile, User

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

        seed_users = [
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
                "category_slug": "decoracao",
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

        users_by_email = {}
        for data in seed_users:
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
                category = categories_by_slug.get(data.get("category_slug", ""))
                db.add(
                    ProviderProfile(
                        user_id=user.id,
                        category_id=category.id if category else None,
                    )
                )
            elif data["role"] == RoleEnum.ASSESSOR:
                db.add(AssessorProfile(user_id=user.id, referral_code="ISABELA-TT25"))

            print(f"[criado] {data['email']} ({data['role'].value})")

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
            wedding_event = event
        else:
            print("[skip] evento seed já existe")
            wedding_event = existing_event

        # segunda solicitação, ainda aberta (sem proposta) — aparece como
        # oportunidade real no dashboard do fornecedor
        open_quote = (
            db.query(QuoteRequest)
            .filter(
                QuoteRequest.event_id == wedding_event.id,
                QuoteRequest.category_id == categories_by_slug["decoracao"].id,
                QuoteRequest.status == QuoteRequestStatusEnum.ABERTO,
            )
            .first()
        )
        if open_quote is None:
            db.add(
                QuoteRequest(
                    event_id=wedding_event.id,
                    contratante_id=contratante.id,
                    provider_id=None,  # aberto pra qualquer fornecedor da categoria
                    category_id=categories_by_slug["decoracao"].id,
                    source="marketplace",
                    budget=12000,
                    vision_text="Precisamos também de arranjos florais para a cerimônia ao ar livre,"
                    " estilo boho, com tons pastéis.",
                    status=QuoteRequestStatusEnum.ABERTO,
                )
            )
            db.commit()
            print("[criado] segunda solicitação em aberto (oportunidade para fornecedores)")

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

        # vínculo de indicação: Guto foi indicado pela assessora Isabela
        assessor = users_by_email["assessor@timtim.com.br"]
        provider_profile = db.get(ProviderProfile, provider.id)
        if provider_profile is not None and provider_profile.referred_by_assessor_id is None:
            provider_profile.referred_by_assessor_id = assessor.id
            db.commit()
            print("[criado] vínculo de indicação: Guto indicado por Isabela")

        # contrato já fechado num evento antigo, pra assessora ter uma
        # comissão de verdade pra mostrar no painel de indicações
        noivado_event = (
            db.query(Event)
            .filter(Event.contratante_id == contratante.id, Event.name == "Festa de Noivado")
            .first()
        )
        existing_commission = (
            db.query(Commission).filter(Commission.assessor_id == assessor.id).first()
        )
        if noivado_event is not None and existing_commission is None:
            referral_quote = QuoteRequest(
                event_id=noivado_event.id,
                contratante_id=contratante.id,
                provider_id=provider.id,
                category_id=categories_by_slug["decoracao"].id,
                source="indicacao",
                status=QuoteRequestStatusEnum.RESPONDIDO,
            )
            db.add(referral_quote)
            db.flush()

            referral_proposal = Proposal(
                quote_request_id=referral_quote.id,
                provider_id=provider.id,
                title="Decoração da Festa de Noivado",
                category_id=categories_by_slug["decoracao"].id,
                deadline=noivado_event.event_date,
                amount=8000,
                payment_term="à vista",
                validity_days=7,
                scope_text="Decoração completa da festa de noivado.",
                status=ProposalStatusEnum.CONTRATO,
            )
            db.add(referral_proposal)
            db.flush()

            referral_contract = Contract(
                proposal_id=referral_proposal.id,
                contratante_id=contratante.id,
                provider_id=provider.id,
                event_id=noivado_event.id,
                contract_code="",  # preenchido abaixo, depois que o id real existe
                value=referral_proposal.amount,
                service_status=ServiceStatusEnum.CONCLUIDO,
                payment_status=EscrowStatusEnum.QUITADO,
            )
            db.add(referral_contract)
            db.flush()
            referral_contract.contract_code = f"TT-{date.today().year}-{referral_contract.id:04d}"

            db.add(
                Commission(
                    assessor_id=assessor.id,
                    contract_id=referral_contract.id,
                    provider_id=provider.id,
                    amount=referral_proposal.amount * Decimal("0.05"),
                    percent=Decimal("5.00"),
                    status=CommissionStatusEnum.CONFIRMADA,
                )
            )
            db.commit()
            print("[criado] contrato + comissão de indicação para Isabela")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
