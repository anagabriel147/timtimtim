from app.models.enums import RoleEnum


def _make_contract_for(make_event, make_quote_request, make_proposal, make_contract, ana, guto):
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto)
    return make_contract(proposal, ana, guto, event, value="1000.00")


def test_contratante_sees_only_own_contracts(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    guto = make_user(RoleEnum.FORNECEDOR)
    _make_contract_for(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
    _make_contract_for(make_event, make_quote_request, make_proposal, make_contract, bia, guto)

    resp = client.get("/contracts", headers=auth_headers(ana))

    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["contratante_id"] == ana.id


def test_fornecedor_sees_only_own_contracts(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR, email="guto@example.com")
    outro = make_user(RoleEnum.FORNECEDOR, email="outro@example.com")
    _make_contract_for(make_event, make_quote_request, make_proposal, make_contract, ana, guto)
    _make_contract_for(make_event, make_quote_request, make_proposal, make_contract, ana, outro)

    resp = client.get("/contracts", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["provider_id"] == guto.id


def test_get_contract_404_for_non_owner(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract_for(
        make_event, make_quote_request, make_proposal, make_contract, ana, guto
    )

    resp = client.get(f"/contracts/{contract.id}", headers=auth_headers(bia))

    assert resp.status_code == 404


def test_get_contract_200_for_owner_provider(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract_for(
        make_event, make_quote_request, make_proposal, make_contract, ana, guto
    )

    resp = client.get(f"/contracts/{contract.id}", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert resp.json()["id"] == contract.id
