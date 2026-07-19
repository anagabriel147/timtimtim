from app.models.enums import RoleEnum


def _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto):
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto)
    return make_contract(proposal, ana, guto, event)


DISPUTE_PAYLOAD = {
    "category": "qualidade_abaixo",
    "severity": "medio",
    "statement_text": "Relato do problema.",
    "requested_resolution": "parcial",
}


def test_create_dispute_by_contract_owner(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    resp = client.post(
        "/disputes",
        headers=auth_headers(ana),
        json={"contract_id": contract.id, **DISPUTE_PAYLOAD},
    )

    assert resp.status_code == 201
    body = resp.json()
    assert body["contract_id"] == contract.id
    assert body["status"] == "aberta"


def test_dispute_respondent_is_the_contract_provider(
    client, db, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    from app.models.dispute import Dispute

    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    resp = client.post(
        "/disputes",
        headers=auth_headers(ana),
        json={"contract_id": contract.id, **DISPUTE_PAYLOAD},
    )

    dispute = db.get(Dispute, resp.json()["id"])
    assert dispute.respondent_user_id == guto.id
    assert dispute.opened_by_user_id == ana.id


def test_create_dispute_404_for_non_owner(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    resp = client.post(
        "/disputes",
        headers=auth_headers(bia),
        json={"contract_id": contract.id, **DISPUTE_PAYLOAD},
    )

    assert resp.status_code == 404


def test_fornecedor_cannot_open_dispute_on_own_contract(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    """O fornecedor é o respondent, não quem abre — não é o contratante_id do
    contrato, então a checagem de posse já bloqueia isso como 404."""
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    resp = client.post(
        "/disputes",
        headers=auth_headers(guto),
        json={"contract_id": contract.id, **DISPUTE_PAYLOAD},
    )

    assert resp.status_code == 404


def test_create_dispute_allows_a_second_dispute_on_same_contract(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    """Sem restrição de unicidade no backend — um contrato pode ter mais de
    uma disputa aberta."""
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    first = client.post(
        "/disputes", headers=auth_headers(ana), json={"contract_id": contract.id, **DISPUTE_PAYLOAD}
    )
    second = client.post(
        "/disputes", headers=auth_headers(ana), json={"contract_id": contract.id, **DISPUTE_PAYLOAD}
    )

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["id"] != second.json()["id"]
