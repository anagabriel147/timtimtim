import pytest

from app.models.enums import RoleEnum

ENDPOINTS = [
    "/admin/kpis",
    "/admin/disputes",
    "/admin/ecosystem-activity",
    "/admin/platform-health",
    "/admin/top-vendors",
]


def _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto, **kwargs):
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto)
    return make_contract(proposal, ana, guto, event, **kwargs)


@pytest.mark.parametrize("path", ENDPOINTS)
def test_403_for_non_admin(client, make_user, auth_headers, path):
    ana = make_user(RoleEnum.CONTRATANTE)
    resp = client.get(path, headers=auth_headers(ana))
    assert resp.status_code == 403


class TestKpis:
    def test_mrr_only_counts_ativa_subscriptions_not_trial(
        self, client, make_user, auth_headers, make_plan, make_subscription
    ):
        """Regressão: MRR já contou TRIAL como receita recorrente de verdade
        (bug real, corrigido). Assinante em trial não paga nada ainda."""
        admin = make_user(RoleEnum.ADMIN)
        plan = make_plan(price_cents=9900)  # R$99/mês

        paying = make_user(RoleEnum.FORNECEDOR, email="paga@example.com")
        make_subscription(paying, plan, status="ativa")

        trial = make_user(RoleEnum.FORNECEDOR, email="trial@example.com")
        make_subscription(trial, plan, status="trial")

        resp = client.get("/admin/kpis", headers=auth_headers(admin))

        assert resp.status_code == 200
        body = resp.json()
        # conta os 2 como "assinantes ativos" (uso da plataforma)...
        assert body["active_subscribers"] == 2
        # ...mas o MRR (receita de verdade) só inclui quem está pagando
        assert body["mrr"] == "99.00" or body["mrr"] == "99.0"

    def test_mrr_divides_annual_plan_by_12(self, client, make_user, auth_headers, make_plan, make_subscription):
        admin = make_user(RoleEnum.ADMIN)
        plan = make_plan(billing_cycle="anual", price_cents=120000)  # R$1200/ano
        subscriber = make_user(RoleEnum.FORNECEDOR)
        make_subscription(subscriber, plan, status="ativa")

        resp = client.get("/admin/kpis", headers=auth_headers(admin))

        assert float(resp.json()["mrr"]) == pytest.approx(100.0)

    def test_referral_commissions_paid_excludes_pending(
        self,
        client,
        make_user,
        auth_headers,
        make_event,
        make_quote_request,
        make_proposal,
        make_contract,
        make_commission,
    ):
        admin = make_user(RoleEnum.ADMIN)
        isabela = make_user(RoleEnum.ASSESSOR)
        ana = make_user(RoleEnum.CONTRATANTE)
        guto = make_user(RoleEnum.FORNECEDOR)
        contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
        make_commission(isabela, contract, amount="400.00", status="confirmada")
        make_commission(isabela, contract, amount="150.00", status="pendente")

        resp = client.get("/admin/kpis", headers=auth_headers(admin))

        assert resp.json()["referral_commissions_paid"] == "400.00"

    def test_gross_volume_sums_all_contracts_regardless_of_status(
        self, client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
    ):
        admin = make_user(RoleEnum.ADMIN)
        ana = make_user(RoleEnum.CONTRATANTE)
        guto = make_user(RoleEnum.FORNECEDOR)
        _make_contract(
            make_event, make_quote_request, make_proposal, make_contract, ana, guto,
            value="8000.00", service_status="concluido", payment_status="quitado",
        )
        _make_contract(
            make_event, make_quote_request, make_proposal, make_contract, ana, guto,
            value="3800.00", service_status="andamento", payment_status="aguardando",
        )

        resp = client.get("/admin/kpis", headers=auth_headers(admin))

        assert resp.json()["gross_volume"] == "11800.00"


class TestDisputes:
    def test_lists_only_open_disputes(
        self,
        client,
        make_user,
        auth_headers,
        make_event,
        make_quote_request,
        make_proposal,
        make_contract,
    ):
        admin = make_user(RoleEnum.ADMIN)
        ana = make_user(RoleEnum.CONTRATANTE)
        guto = make_user(RoleEnum.FORNECEDOR, name="Guto Decorações")
        contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

        open_resp = client.post(
            "/disputes",
            headers=auth_headers(ana),
            json={
                "contract_id": contract.id,
                "category": "qualidade_abaixo",
                "severity": "medio",
                "statement_text": "Problema real.",
                "requested_resolution": "parcial",
            },
        )
        assert open_resp.status_code == 201

        resp = client.get("/admin/disputes", headers=auth_headers(admin))

        assert resp.status_code == 200
        body = resp.json()
        assert len(body) == 1
        assert body[0]["contract_code"] == contract.contract_code
        assert body[0]["respondent_name"] == "Guto Decorações"
        assert body[0]["events_count"] == 0

    def test_no_open_disputes_returns_empty_list(self, client, make_user, auth_headers):
        admin = make_user(RoleEnum.ADMIN)
        resp = client.get("/admin/disputes", headers=auth_headers(admin))
        assert resp.status_code == 200
        assert resp.json() == []


class TestPlatformHealth:
    def test_conversion_rate_is_contracts_over_quote_requests(
        self, client, make_user, auth_headers, make_quote_request, make_event, make_proposal, make_contract
    ):
        admin = make_user(RoleEnum.ADMIN)
        ana = make_user(RoleEnum.CONTRATANTE)
        guto = make_user(RoleEnum.FORNECEDOR)

        # 1 quote request vira contrato, outro fica solto — 50% de conversão
        _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
        make_quote_request(ana)

        resp = client.get("/admin/platform-health", headers=auth_headers(admin))

        assert resp.status_code == 200
        assert resp.json()["conversion_rate"] == 50.0

    def test_zero_quote_requests_gives_zero_conversion_not_error(self, client, make_user, auth_headers):
        admin = make_user(RoleEnum.ADMIN)
        resp = client.get("/admin/platform-health", headers=auth_headers(admin))
        assert resp.status_code == 200
        assert resp.json()["conversion_rate"] == 0.0
        assert resp.json()["avg_rating"] is None

    def test_avg_rating_from_reviews(
        self,
        client,
        make_user,
        auth_headers,
        make_event,
        make_quote_request,
        make_proposal,
        make_contract,
        make_review,
    ):
        admin = make_user(RoleEnum.ADMIN)
        ana = make_user(RoleEnum.CONTRATANTE)
        guto = make_user(RoleEnum.FORNECEDOR)
        c1 = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
        c2 = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
        make_review(c1, ana, rating_overall=5)
        make_review(c2, ana, rating_overall=3)

        resp = client.get("/admin/platform-health", headers=auth_headers(admin))

        assert resp.json()["avg_rating"] == 4.0

    def test_contracts_completed_rate(
        self, client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
    ):
        admin = make_user(RoleEnum.ADMIN)
        ana = make_user(RoleEnum.CONTRATANTE)
        guto = make_user(RoleEnum.FORNECEDOR)
        _make_contract(
            make_event, make_quote_request, make_proposal, make_contract, ana, guto,
            service_status="concluido",
        )
        _make_contract(
            make_event, make_quote_request, make_proposal, make_contract, ana, guto,
            service_status="andamento",
        )

        resp = client.get("/admin/platform-health", headers=auth_headers(admin))

        assert resp.json()["contracts_completed_rate"] == 50.0


class TestTopVendors:
    def test_ranked_by_total_contract_value_desc(
        self, client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
    ):
        admin = make_user(RoleEnum.ADMIN)
        ana = make_user(RoleEnum.CONTRATANTE)
        guto = make_user(RoleEnum.FORNECEDOR, name="Guto Decorações")
        outro = make_user(RoleEnum.FORNECEDOR, email="outro@example.com", name="Outro Fornecedor")

        _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto, value="8000.00")
        _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto, value="3800.00")
        _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, outro, value="1000.00")

        resp = client.get("/admin/top-vendors", headers=auth_headers(admin))

        assert resp.status_code == 200
        body = resp.json()
        assert body[0]["provider_name"] == "Guto Decorações"
        assert body[0]["total_revenue"] == "11800.00"
        assert body[1]["provider_name"] == "Outro Fornecedor"

    def test_empty_when_no_contracts(self, client, make_user, auth_headers):
        admin = make_user(RoleEnum.ADMIN)
        resp = client.get("/admin/top-vendors", headers=auth_headers(admin))
        assert resp.status_code == 200
        assert resp.json() == []


class TestEcosystemActivity:
    def test_returns_6_months(self, client, make_user, auth_headers, make_event):
        admin = make_user(RoleEnum.ADMIN)
        ana = make_user(RoleEnum.CONTRATANTE)
        make_event(ana)

        resp = client.get("/admin/ecosystem-activity", headers=auth_headers(admin))

        assert resp.status_code == 200
        body = resp.json()
        assert len(body) == 6
        assert body[-1]["events_count"] == 1
        assert all(m["events_count"] == 0 for m in body[:-1])
