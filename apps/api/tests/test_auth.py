from app.models.enums import RoleEnum


def test_login_success_returns_token_and_user(client, make_user):
    make_user(RoleEnum.CONTRATANTE, email="ana@example.com", name="Ana", password="12345")

    resp = client.post("/auth/login", json={"email": "ana@example.com", "password": "12345"})

    assert resp.status_code == 200
    body = resp.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["user"]["email"] == "ana@example.com"
    assert body["user"]["role"] == "contratante"


def test_login_wrong_password_returns_generic_401(client, make_user):
    make_user(RoleEnum.CONTRATANTE, email="ana@example.com", password="12345")

    resp = client.post("/auth/login", json={"email": "ana@example.com", "password": "errada"})

    assert resp.status_code == 401
    assert resp.json()["detail"] == "E-mail ou senha incorretos."


def test_login_nonexistent_email_returns_same_generic_401(client):
    resp = client.post("/auth/login", json={"email": "ninguem@example.com", "password": "x"})

    assert resp.status_code == 401
    assert resp.json()["detail"] == "E-mail ou senha incorretos."


def test_login_is_case_insensitive_on_email(client, make_user):
    make_user(RoleEnum.CONTRATANTE, email="ana@example.com", password="12345")

    resp = client.post("/auth/login", json={"email": "ANA@EXAMPLE.COM", "password": "12345"})

    assert resp.status_code == 200


def test_me_without_token_is_401(client):
    resp = client.get("/auth/me")
    assert resp.status_code == 401


def test_me_with_valid_token_returns_current_user(client, make_user, auth_headers):
    user = make_user(RoleEnum.FORNECEDOR, email="guto@example.com", name="Guto")

    resp = client.get("/auth/me", headers=auth_headers(user))

    assert resp.status_code == 200
    assert resp.json()["email"] == "guto@example.com"
    assert resp.json()["role"] == "fornecedor"


def test_me_with_invalid_token_is_401(client):
    resp = client.get("/auth/me", headers={"Authorization": "Bearer garbage-token"})
    assert resp.status_code == 401


def test_inactive_user_cannot_authenticate(client, make_user, auth_headers):
    user = make_user(RoleEnum.CONTRATANTE, email="inativa@example.com", is_active=False)

    resp = client.get("/auth/me", headers=auth_headers(user))

    assert resp.status_code == 401
