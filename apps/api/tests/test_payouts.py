"""Cobre /payouts (fornecedor) e /assessor-payouts (assessor) juntos — são
estruturalmente idênticos hoje (mesma regra, tabelas separadas de propósito,
ver comentário em app/models/payout.py)."""

import pytest

from app.models.enums import RoleEnum

CASES = [
    ("/payouts", RoleEnum.FORNECEDOR, RoleEnum.CONTRATANTE),
    ("/assessor-payouts", RoleEnum.ASSESSOR, RoleEnum.CONTRATANTE),
]


@pytest.mark.parametrize("path,owner_role,other_role", CASES)
def test_list_requires_correct_role(client, make_user, auth_headers, path, owner_role, other_role):
    intruder = make_user(other_role)
    resp = client.get(path, headers=auth_headers(intruder))
    assert resp.status_code == 403


@pytest.mark.parametrize("path,owner_role,other_role", CASES)
def test_create_requires_correct_role(client, make_user, auth_headers, path, owner_role, other_role):
    intruder = make_user(other_role)
    resp = client.post(path, headers=auth_headers(intruder), json={"amount": "100.00"})
    assert resp.status_code == 403


@pytest.mark.parametrize("path,owner_role,other_role", CASES)
def test_create_rejects_non_positive_amount(client, make_user, auth_headers, path, owner_role, other_role):
    owner = make_user(owner_role)
    resp = client.post(path, headers=auth_headers(owner), json={"amount": "0"})
    assert resp.status_code == 400

    resp_negative = client.post(path, headers=auth_headers(owner), json={"amount": "-10"})
    assert resp_negative.status_code == 400


@pytest.mark.parametrize("path,owner_role,other_role", CASES)
def test_create_payout_success(client, make_user, auth_headers, path, owner_role, other_role):
    owner = make_user(owner_role)
    resp = client.post(
        path, headers=auth_headers(owner), json={"amount": "250.50", "pix_key": "owner@example.com"}
    )

    assert resp.status_code == 201
    body = resp.json()
    assert body["amount"] == "250.50"
    assert body["status"] == "analise"
    assert body["method"] == "pix"


@pytest.mark.parametrize("path,owner_role,other_role", CASES)
def test_list_only_returns_own_payouts(client, make_user, auth_headers, path, owner_role, other_role):
    owner = make_user(owner_role, email="owner@example.com")
    someone_else = make_user(owner_role, email="other-owner@example.com")

    client.post(path, headers=auth_headers(owner), json={"amount": "100.00"})
    client.post(path, headers=auth_headers(someone_else), json={"amount": "200.00"})

    resp = client.get(path, headers=auth_headers(owner))

    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["amount"] == "100.00"
