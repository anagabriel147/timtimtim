import pytest

from app.models.enums import RoleEnum

ENDPOINTS = ["/referrals", "/referrals/summary", "/referrals/top-providers", "/referrals/commission-trend"]


def _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto, value="1000.00"):
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto)
    return make_contract(proposal, ana, guto, event, value=value)


@pytest.mark.parametrize("path", ENDPOINTS)
def test_403_for_non_assessor(client, make_user, auth_headers, path):
    ana = make_user(RoleEnum.CONTRATANTE)
    resp = client.get(path, headers=auth_headers(ana))
    assert resp.status_code == 403


def test_list_referrals_only_own(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract, make_commission
):
    isabela = make_user(RoleEnum.ASSESSOR, email="isabela@example.com")
    outra = make_user(RoleEnum.ASSESSOR, email="outra@example.com")
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
    make_commission(isabela, contract)
    make_commission(outra, contract)

    resp = client.get("/referrals", headers=auth_headers(isabela))

    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_summary_excludes_pending_commissions(
    client,
    make_user,
    auth_headers,
    make_event,
    make_quote_request,
    make_proposal,
    make_contract,
    make_commission,
    make_provider_profile,
    make_assessor_profile,
):
    isabela = make_user(RoleEnum.ASSESSOR, email="isabela@example.com")
    make_assessor_profile(isabela, referral_code="ISABELA-TT25")
    guto = make_user(RoleEnum.FORNECEDOR)
    make_provider_profile(guto, referred_by=isabela)
    ana = make_user(RoleEnum.CONTRATANTE)

    confirmed_contract = _make_contract(
        make_event, make_quote_request, make_proposal, make_contract, ana, guto, value="8000.00"
    )
    make_commission(isabela, confirmed_contract, amount="400.00", status="confirmada")

    pending_contract = _make_contract(
        make_event, make_quote_request, make_proposal, make_contract, ana, guto, value="3000.00"
    )
    make_commission(isabela, pending_contract, amount="150.00", status="pendente")

    resp = client.get("/referrals/summary", headers=auth_headers(isabela))

    assert resp.status_code == 200
    body = resp.json()
    assert body["referral_code"] == "ISABELA-TT25"
    assert body["referred_providers"] == 1
    assert body["confirmed_referrals"] == 1
    # só a comissão CONFIRMADA conta — a PENDENTE fica de fora
    assert body["total_commissions"] == "400.00"
    assert body["contracts_volume"] == "8000.00"
    assert body["average_per_referral"] == "400.00"


def test_summary_with_no_referrals_is_all_zero(client, make_user, auth_headers, make_assessor_profile):
    isabela = make_user(RoleEnum.ASSESSOR)
    make_assessor_profile(isabela)

    resp = client.get("/referrals/summary", headers=auth_headers(isabela))

    assert resp.status_code == 200
    body = resp.json()
    assert body["referred_providers"] == 0
    assert body["confirmed_referrals"] == 0
    assert body["conversion_rate"] == 0.0
    assert body["total_commissions"] == "0"


def test_top_providers_ranked_by_earned_commission(
    client,
    make_user,
    auth_headers,
    make_event,
    make_quote_request,
    make_proposal,
    make_contract,
    make_commission,
):
    isabela = make_user(RoleEnum.ASSESSOR)
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR, email="guto@example.com", name="Guto Decorações")
    outro = make_user(RoleEnum.FORNECEDOR, email="outro@example.com", name="Outro Fornecedor")

    c1 = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
    make_commission(isabela, c1, amount="500.00", status="confirmada")

    c2 = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, outro)
    make_commission(isabela, c2, amount="250.00", status="confirmada")

    resp = client.get("/referrals/top-providers", headers=auth_headers(isabela))

    assert resp.status_code == 200
    body = resp.json()
    assert body[0]["provider_name"] == "Guto Decorações"
    assert body[0]["percent"] == 100.0
    assert body[1]["provider_name"] == "Outro Fornecedor"
    assert body[1]["percent"] == 50.0


def test_commission_trend_has_6_months_zero_filled(
    client,
    make_user,
    auth_headers,
    make_event,
    make_quote_request,
    make_proposal,
    make_contract,
    make_commission,
):
    isabela = make_user(RoleEnum.ASSESSOR)
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
    make_commission(isabela, contract, amount="400.00", status="confirmada")

    resp = client.get("/referrals/commission-trend", headers=auth_headers(isabela))

    assert resp.status_code == 200
    months = resp.json()
    assert len(months) == 6
    # o mês atual (último da lista, ordem cronológica) deve ter a comissão
    assert months[-1]["total"] == "400.00"
    assert all(m["total"] == "0" for m in months[:-1])
