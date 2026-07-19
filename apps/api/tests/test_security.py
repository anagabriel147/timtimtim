import jwt
import pytest

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_hash_password_produces_verifiable_hash():
    hashed = hash_password("minhasenha123")
    assert hashed != "minhasenha123"
    assert verify_password("minhasenha123", hashed) is True


def test_verify_password_rejects_wrong_password():
    hashed = hash_password("minhasenha123")
    assert verify_password("senha-errada", hashed) is False


def test_access_token_roundtrip():
    token = create_access_token(subject="42")
    assert decode_access_token(token) == "42"


def test_decode_rejects_tampered_token():
    token = create_access_token(subject="42")
    mid = len(token) // 2
    tampered = token[:mid] + ("X" if token[mid] != "X" else "Y") + token[mid + 1 :]
    with pytest.raises(jwt.PyJWTError):
        decode_access_token(tampered)


def test_decode_rejects_garbage_token():
    with pytest.raises(jwt.PyJWTError):
        decode_access_token("not-a-real-jwt-at-all")
