from app.models.enums import ProposalStatusEnum, QuoteRequestStatusEnum, RoleEnum

PROPOSAL_PAYLOAD = {
    "title": "Decoração completa",
    "amount": "5000.00",
    "payment_term": "à vista",
}


def test_create_proposal_403_for_non_fornecedor(client, make_user, auth_headers, make_quote_request):
    ana = make_user(RoleEnum.CONTRATANTE)
    qr = make_quote_request(ana)
    resp = client.post(
        "/proposals",
        headers=auth_headers(ana),
        json={"quote_request_id": qr.id, **PROPOSAL_PAYLOAD},
    )
    assert resp.status_code == 403


def test_create_proposal_404_for_missing_quote_request(client, make_user, auth_headers):
    guto = make_user(RoleEnum.FORNECEDOR)
    resp = client.post(
        "/proposals",
        headers=auth_headers(guto),
        json={"quote_request_id": 999999, **PROPOSAL_PAYLOAD},
    )
    assert resp.status_code == 404


def test_create_proposal_403_when_directed_at_another_provider(
    client, make_user, auth_headers, make_quote_request
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR, email="guto@example.com")
    outro = make_user(RoleEnum.FORNECEDOR, email="outro@example.com")
    qr = make_quote_request(ana, provider=guto)

    resp = client.post(
        "/proposals",
        headers=auth_headers(outro),
        json={"quote_request_id": qr.id, **PROPOSAL_PAYLOAD},
    )

    assert resp.status_code == 403


def test_create_proposal_409_on_duplicate(
    client, make_user, auth_headers, make_quote_request, make_proposal
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    qr = make_quote_request(ana, provider=None)
    make_proposal(qr, guto)

    resp = client.post(
        "/proposals",
        headers=auth_headers(guto),
        json={"quote_request_id": qr.id, **PROPOSAL_PAYLOAD},
    )

    assert resp.status_code == 409


def test_targeted_quote_request_closes_on_first_proposal(
    client, db, make_user, auth_headers, make_quote_request
):
    """Solicitação DIRECIONADA a um fornecedor específico: só ele pode
    responder, então fecha (RESPONDIDO) assim que ele envia a proposta."""
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    qr = make_quote_request(ana, provider=guto)

    resp = client.post(
        "/proposals",
        headers=auth_headers(guto),
        json={"quote_request_id": qr.id, **PROPOSAL_PAYLOAD},
    )

    assert resp.status_code == 201
    db.refresh(qr)
    assert qr.status == QuoteRequestStatusEnum.RESPONDIDO


def test_broadcast_quote_request_stays_open_after_one_proposal(
    client, db, make_user, auth_headers, make_category, make_provider_profile, make_quote_request
):
    """Regressão: solicitação BROADCAST (sem fornecedor específico) não pode
    fechar pra todo mundo só porque UM fornecedor respondeu — outros da
    categoria ainda devem poder concorrer. Bug real já corrigido antes
    desta suíte existir; este teste existe pra nunca mais voltar."""
    category = make_category()
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR, email="guto@example.com")
    make_provider_profile(guto, category=category)
    qr = make_quote_request(ana, provider=None, category=category)

    resp = client.post(
        "/proposals",
        headers=auth_headers(guto),
        json={"quote_request_id": qr.id, **PROPOSAL_PAYLOAD},
    )

    assert resp.status_code == 201
    db.refresh(qr)
    assert qr.status == QuoteRequestStatusEnum.ABERTO

    # outro fornecedor da mesma categoria ainda enxerga a oportunidade
    outro = make_user(RoleEnum.FORNECEDOR, email="outro@example.com")
    make_provider_profile(outro, category=category)
    opps = client.get("/opportunities", headers=auth_headers(outro))
    assert [o["id"] for o in opps.json()] == [qr.id]


def test_list_my_proposals_403_for_non_fornecedor(client, make_user, auth_headers):
    ana = make_user(RoleEnum.CONTRATANTE)
    resp = client.get("/proposals/mine", headers=auth_headers(ana))
    assert resp.status_code == 403


def test_list_my_proposals_only_own(
    client, make_user, auth_headers, make_quote_request, make_proposal
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR, email="guto@example.com")
    outro = make_user(RoleEnum.FORNECEDOR, email="outro@example.com")
    qr1 = make_quote_request(ana, provider=None)
    qr2 = make_quote_request(ana, provider=None)
    make_proposal(qr1, guto)
    make_proposal(qr2, outro)

    resp = client.get("/proposals/mine", headers=auth_headers(guto))

    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_accept_proposal_creates_contract(
    client, db, make_user, auth_headers, make_event, make_quote_request, make_proposal
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto, amount="7500.00")

    resp = client.post(f"/proposals/{proposal.id}/accept", headers=auth_headers(ana))

    assert resp.status_code == 200
    body = resp.json()
    assert body["value"] == "7500.00"
    assert body["contract_code"].startswith("TT-")

    db.refresh(proposal)
    db.refresh(qr)
    assert proposal.status == ProposalStatusEnum.CONTRATO
    assert qr.status == QuoteRequestStatusEnum.RESPONDIDO


def test_accept_proposal_closes_broadcast_for_all_providers(
    client,
    db,
    make_user,
    auth_headers,
    make_category,
    make_provider_profile,
    make_event,
    make_quote_request,
    make_proposal,
):
    """Ao aceitar UMA proposta de uma solicitação broadcast, ela fecha pra
    todo mundo — outros fornecedores param de ver a oportunidade."""
    category = make_category()
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR, email="guto@example.com")
    make_provider_profile(guto, category=category)
    outro = make_user(RoleEnum.FORNECEDOR, email="outro@example.com")
    make_provider_profile(outro, category=category)
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=None, category=category)
    proposal = make_proposal(qr, guto)

    accept_resp = client.post(f"/proposals/{proposal.id}/accept", headers=auth_headers(ana))
    assert accept_resp.status_code == 200

    opps = client.get("/opportunities", headers=auth_headers(outro))
    assert opps.json() == []


def test_accept_proposal_404_for_non_owner_contratante(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal
):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    guto = make_user(RoleEnum.FORNECEDOR)
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto)

    resp = client.post(f"/proposals/{proposal.id}/accept", headers=auth_headers(bia))

    assert resp.status_code == 404


def test_accept_proposal_409_when_already_has_contract(
    client, make_user, auth_headers, make_event, make_quote_request, make_proposal
):
    ana = make_user(RoleEnum.CONTRATANTE)
    guto = make_user(RoleEnum.FORNECEDOR)
    event = make_event(ana)
    qr = make_quote_request(ana, event=event, provider=guto)
    proposal = make_proposal(qr, guto)

    first = client.post(f"/proposals/{proposal.id}/accept", headers=auth_headers(ana))
    assert first.status_code == 200

    second = client.post(f"/proposals/{proposal.id}/accept", headers=auth_headers(ana))
    assert second.status_code == 409


def test_reject_proposal_sets_status_and_requires_ownership(
    client, db, make_user, auth_headers, make_quote_request, make_proposal
):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    guto = make_user(RoleEnum.FORNECEDOR)
    qr = make_quote_request(ana, provider=guto)
    proposal = make_proposal(qr, guto)

    forbidden = client.post(f"/proposals/{proposal.id}/reject", headers=auth_headers(bia))
    assert forbidden.status_code == 404

    resp = client.post(f"/proposals/{proposal.id}/reject", headers=auth_headers(ana))
    assert resp.status_code == 200
    db.refresh(proposal)
    assert proposal.status == ProposalStatusEnum.RECUSADA
