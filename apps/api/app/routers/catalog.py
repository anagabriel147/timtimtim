from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.catalog import ServiceCategory
from app.models.user import User
from app.schemas.event import ServiceCategoryOut

router = APIRouter(prefix="/categories", tags=["catalog"])


@router.get("", response_model=list[ServiceCategoryOut])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ServiceCategory]:
    return db.query(ServiceCategory).order_by(ServiceCategory.name).all()
