from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import ModerationStatusEnum, RoleEnum


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(30))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[RoleEnum] = mapped_column()
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    provider_profile: Mapped["ProviderProfile | None"] = relationship(
        back_populates="user",
        uselist=False,
        foreign_keys="ProviderProfile.user_id",
    )
    assessor_profile: Mapped["AssessorProfile | None"] = relationship(
        back_populates="user", uselist=False
    )


class ProviderProfile(Base):
    """1:1 com User onde role=FORNECEDOR."""

    __tablename__ = "provider_profiles"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    company_name: Mapped[str | None] = mapped_column(String(160))
    document_type: Mapped[str | None] = mapped_column(String(10))  # 'cpf' | 'cnpj'
    document_number: Mapped[str | None] = mapped_column(String(20))
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("service_categories.id"), index=True
    )
    bio: Mapped[str | None] = mapped_column(String(2000))
    service_area: Mapped[str | None] = mapped_column(String(200))
    tier: Mapped[str | None] = mapped_column(String(50))
    level: Mapped[str | None] = mapped_column(String(50))
    rating_avg: Mapped[float | None]
    rating_count: Mapped[int] = mapped_column(default=0)
    moderation_status: Mapped[ModerationStatusEnum] = mapped_column(
        default=ModerationStatusEnum.PENDENTE
    )
    referred_by_assessor_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), index=True
    )

    user: Mapped["User"] = relationship(
        back_populates="provider_profile", foreign_keys=[user_id]
    )
    category: Mapped["ServiceCategory | None"] = relationship()
    referred_by: Mapped["User | None"] = relationship(foreign_keys=[referred_by_assessor_id])


class AssessorProfile(Base):
    """1:1 com User onde role=ASSESSOR."""

    __tablename__ = "assessor_profiles"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    company_name: Mapped[str | None] = mapped_column(String(160))
    document_type: Mapped[str | None] = mapped_column(String(10))
    document_number: Mapped[str | None] = mapped_column(String(20))
    referral_code: Mapped[str] = mapped_column(String(30), unique=True)

    user: Mapped["User"] = relationship(back_populates="assessor_profile")
