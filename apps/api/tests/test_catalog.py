from app.models.enums import RoleEnum


def test_list_categories_sorted_by_name(client, make_user, auth_headers, make_category):
    user = make_user(RoleEnum.CONTRATANTE)
    make_category(name="Zebra", slug="zebra")
    make_category(name="Alpha", slug="alpha")

    resp = client.get("/categories", headers=auth_headers(user))

    assert resp.status_code == 200
    names = [c["name"] for c in resp.json()]
    assert names == ["Alpha", "Zebra"]


def test_list_categories_requires_authentication(client):
    resp = client.get("/categories")
    assert resp.status_code == 401
