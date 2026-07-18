"""Popula o banco com os mesmos 4 usuários que hoje estão hardcoded no
login mock do frontend (mesmas credenciais), agora com senha hasheada de
verdade num banco de verdade.

Uso: python -m app.seed
"""

from app.core.security import hash_password
from app.db import Base, SessionLocal, engine
from app.models.enums import RoleEnum
from app.models.user import AssessorProfile, ProviderProfile, User

SEED_USERS = [
    {
        "name": "Ana",
        "email": "ana@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.CONTRATANTE,
    },
    {
        "name": "Guto Decorações",
        "email": "fornecedor@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.FORNECEDOR,
    },
    {
        "name": "Isabela Assessora",
        "email": "assessor@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.ASSESSOR,
    },
    {
        "name": "Admin TimTim",
        "email": "admin@timtim.com.br",
        "password": "12345",
        "role": RoleEnum.ADMIN,
    },
]


def seed() -> None:
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        for data in SEED_USERS:
            existing = db.query(User).filter(User.email == data["email"]).first()
            if existing:
                print(f"[skip] {data['email']} já existe")
                continue

            user = User(
                name=data["name"],
                email=data["email"],
                password_hash=hash_password(data["password"]),
                role=data["role"],
            )
            db.add(user)
            db.flush()

            if data["role"] == RoleEnum.FORNECEDOR:
                db.add(ProviderProfile(user_id=user.id))
            elif data["role"] == RoleEnum.ASSESSOR:
                db.add(AssessorProfile(user_id=user.id, referral_code="ISABELA-TT25"))

            print(f"[criado] {data['email']} ({data['role'].value})")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
