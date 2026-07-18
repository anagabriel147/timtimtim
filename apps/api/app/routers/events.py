from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models.event import Event
from app.models.catalog import ServiceCategory
from app.models.user import User
from app.schemas.event import EventCreate, EventOut

router = APIRouter(prefix="/events", tags=["events"])


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    payload: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Event:
    categories = []
    if payload.service_category_ids:
        categories = (
            db.query(ServiceCategory)
            .filter(ServiceCategory.id.in_(payload.service_category_ids))
            .all()
        )

    event = Event(
        contratante_id=current_user.id,
        type=payload.type,
        name=payload.name,
        event_date=payload.event_date,
        guests_count=payload.guests_count,
        notes=payload.notes,
        country=payload.country,
        district=payload.district,
        city=payload.city,
        venue_name=payload.venue_name,
        address=payload.address,
        venue_status=payload.venue_status,
        service_categories=categories,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("", response_model=list[EventOut])
def list_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Event]:
    return (
        db.query(Event)
        .filter(Event.contratante_id == current_user.id)
        .order_by(Event.created_at.desc())
        .all()
    )


@router.get("/{event_id}", response_model=EventOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Event:
    event = db.get(Event, event_id)
    if event is None or event.contratante_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento não encontrado.")
    return event
