from app.models.enums import RoleEnum


def test_create_event_owned_by_current_user(client, make_user, auth_headers):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")

    resp = client.post(
        "/events",
        headers=auth_headers(ana),
        json={"type": "casamento", "name": "Casamento da Ana"},
    )

    assert resp.status_code == 201
    body = resp.json()
    assert body["name"] == "Casamento da Ana"
    assert body["phase"] == "onboarding"


def test_create_event_with_service_categories(client, make_user, auth_headers, make_category):
    ana = make_user(RoleEnum.CONTRATANTE)
    cat = make_category(name="Buffet", slug="buffet")

    resp = client.post(
        "/events",
        headers=auth_headers(ana),
        json={"type": "casamento", "name": "Evento", "service_category_ids": [cat.id]},
    )

    assert resp.status_code == 201
    assert [c["slug"] for c in resp.json()["service_categories"]] == ["buffet"]


def test_list_events_only_returns_own_events(client, make_user, auth_headers, make_event):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    make_event(ana, name="Evento da Ana")
    make_event(bia, name="Evento da Bia")

    resp = client.get("/events", headers=auth_headers(ana))

    assert resp.status_code == 200
    names = [e["name"] for e in resp.json()]
    assert names == ["Evento da Ana"]


def test_get_event_404_for_non_owner(client, make_user, auth_headers, make_event):
    ana = make_user(RoleEnum.CONTRATANTE, email="ana@example.com")
    bia = make_user(RoleEnum.CONTRATANTE, email="bia@example.com")
    event = make_event(bia)

    resp = client.get(f"/events/{event.id}", headers=auth_headers(ana))

    assert resp.status_code == 404


def test_get_event_404_when_it_does_not_exist(client, make_user, auth_headers):
    ana = make_user(RoleEnum.CONTRATANTE)
    resp = client.get("/events/999999", headers=auth_headers(ana))
    assert resp.status_code == 404


def test_get_event_200_for_owner(client, make_user, auth_headers, make_event):
    ana = make_user(RoleEnum.CONTRATANTE)
    event = make_event(ana, name="Meu Evento")

    resp = client.get(f"/events/{event.id}", headers=auth_headers(ana))

    assert resp.status_code == 200
    assert resp.json()["name"] == "Meu Evento"


def test_events_require_authentication(client):
    resp = client.get("/events")
    assert resp.status_code == 401
