from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 — garante que todas as tabelas registrem no Base.metadata
from app.db import Base, engine
from app.routers import (
    assessor_payouts,
    auth,
    catalog,
    contracts,
    disputes,
    events,
    opportunities,
    payouts,
    proposals,
    referrals,
    reviews,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="TimTim API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(catalog.router)
app.include_router(events.router)
app.include_router(opportunities.router)
app.include_router(proposals.router)
app.include_router(contracts.router)
app.include_router(disputes.router)
app.include_router(reviews.router)
app.include_router(payouts.router)
app.include_router(referrals.router)
app.include_router(assessor_payouts.router)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "TimTim API is running"}
