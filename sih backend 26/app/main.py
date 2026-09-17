from fastapi import FastAPI

from .database import Base, engine
from . import models
from .routes import router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SIH Farmer Procurement Platform",
    description="Backend API for Farmer and Vendor Procurement System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "SIH Farmer Procurement API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(router)