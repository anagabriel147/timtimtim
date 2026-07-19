from app.models.enums import RoleEnum


def test_list_opportunities_403_for_non_fornecedor(client, make_user, auth_headers):
    ana = make_user(RoleEnum.CONTRATANTE)
    resp = client.get("/opportunities", headers=auth_headers(ana))
    assert resp.status_code == 403


def test_list_opportunities_includes_broadcast_matching_category(
    client, make_user, auth_headers, make_category, make_provider_profile, make_quote_request
):
    category = make_category()
    guto = make_user(RoleEnum.FORNECEDOR, email="guto@example.com")
    make_provider_profile(guto, category=category)
    ana = make_user(RoleEnum.CONTRATANTE)
    qr = make_quote_request(ana, provider=None, category=category)  # broadcast

    resp = client.get("/opportunities", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert [o["id"] for o in resp.json()] == [qr.id]


def test_list_opportunities_excludes_broadcast_of_other_category(
    client, make_user, auth_headers, make_category, make_provider_profile, make_quote_request
):
    decoracao = make_category(name="Decoração", slug="decoracao")
    buffet = make_category(name="Buffet", slug="buffet")
    guto = make_user(RoleEnum.FORNECEDOR)
    make_provider_profile(guto, category=decoracao)
    ana = make_user(RoleEnum.CONTRATANTE)
    make_quote_request(ana, provider=None, category=buffet)  # categoria diferente

    resp = client.get("/opportunities", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert resp.json() == []


def test_list_opportunities_includes_directly_assigned_regardless_of_category(
    client, make_user, auth_headers, make_provider_profile, make_quote_request
):
    guto = make_user(RoleEnum.FORNECEDOR)
    make_provider_profile(guto, category=None)
    ana = make_user(RoleEnum.CONTRATANTE)
    qr = make_quote_request(ana, provider=guto)  # direcionado a ele especificamente

    resp = client.get("/opportunities", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert [o["id"] for o in resp.json()] == [qr.id]


def test_list_opportunities_excludes_already_answered(
    client,
    make_user,
    auth_headers,
    make_category,
    make_provider_profile,
    make_quote_request,
    make_proposal,
):
    category = make_category()
    guto = make_user(RoleEnum.FORNECEDOR)
    make_provider_profile(guto, category=category)
    ana = make_user(RoleEnum.CONTRATANTE)
    qr = make_quote_request(ana, provider=None, category=category)
    make_proposal(qr, guto)  # já respondeu

    resp = client.get("/opportunities", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert resp.json() == []


def test_get_opportunity_404_when_ineligible(
    client, make_user, auth_headers, make_category, make_provider_profile, make_quote_request
):
    decoracao = make_category(name="Decoração", slug="decoracao")
    buffet = make_category(name="Buffet", slug="buffet")
    guto = make_user(RoleEnum.FORNECEDOR)
    make_provider_profile(guto, category=decoracao)
    ana = make_user(RoleEnum.CONTRATANTE)
    qr = make_quote_request(ana, provider=None, category=buffet)

    resp = client.get(f"/opportunities/{qr.id}", headers=auth_headers(guto))

    # 404, não 403 — não revela que a solicitação existe pra quem não é elegível
    assert resp.status_code == 404


def test_get_opportunity_200_when_eligible(
    client, make_user, auth_headers, make_category, make_provider_profile, make_quote_request
):
    category = make_category()
    guto = make_user(RoleEnum.FORNECEDOR)
    make_provider_profile(guto, category=category)
    ana = make_user(RoleEnum.CONTRATANTE)
    qr = make_quote_request(ana, provider=None, category=category)

    resp = client.get(f"/opportunities/{qr.id}", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert resp.json()["id"] == qr.id
