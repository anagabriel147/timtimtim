from app.models.enums import RoleEnum


def _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto):
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto)
    return make_contract(proposal, ana, guto, event)


REVIEW_PAYLOAD = {
    "rating_overall": 5,
    "rating_atendimento": 5,
    "rating_pontualidade": 4,
    "rating_qualidade": 5,
    "highlights": ["Pontualidade"],
    "text": "Ótimo serviço.",
    "recommend": True,
}


def test_create_review_by_contract_owner(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    resp = client.post(
        "/reviews", headers=auth_headers(ana), json={"contract_id": contract.id, **REVIEW_PAYLOAD}
    )

    assert resp.status_code == 201
    assert resp.json()["rating_overall"] == 5


def test_create_review_404_for_non_owner(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    resp = client.post(
        "/reviews", headers=auth_headers(bia), json={"contract_id": contract.id, **REVIEW_PAYLOAD}
    )

    assert resp.status_code == 404


def test_create_review_409_on_duplicate_for_same_contract(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    first = client.post(
        "/reviews", headers=auth_headers(ana), json={"contract_id": contract.id, **REVIEW_PAYLOAD}
    )
    second = client.post(
        "/reviews", headers=auth_headers(ana), json={"contract_id": contract.id, **REVIEW_PAYLOAD}
    )

    assert first.status_code == 201
    assert second.status_code == 409


def test_create_review_rejects_rating_out_of_range(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal, make_contract
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    contract = _make_contract(make_event, make_quote_request, make_proposal, make_contract, ana, guto)

    payload = {**REVIEW_PAYLOAD, "rating_overall": 6}
    resp = client.post(
        "/reviews", headers=auth_headers(ana), json={"contract_id": contract.id, **payload}
    )

    assert resp.status_code == 422
