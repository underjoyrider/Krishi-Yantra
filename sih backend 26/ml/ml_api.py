from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# ============================================================
# LOAD MODEL
# ============================================================
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "eta_model.joblib")
model = joblib.load(MODEL_PATH)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="SIH ETA Prediction API",
    description="Estimated Waiting Time Prediction API",
    version="1.0.0"
)


# ============================================================
# REQUEST SCHEMA
# ============================================================

class ETAPredictionRequest(BaseModel):

    centre_id: str
    centre_name: str

    tokens_ahead: int
    queue_length: int
    active_counters: int

    hour_of_day: int
    day_of_week: int
    peak_hour: int

    crop: str
    quantity_kg: float
    quality_grade: str

    staff_experience_years: int
    processing_time_min: float


# ============================================================
# ETA ENDPOINT
# ============================================================

@app.post("/predict-eta")
def predict_eta(data: ETAPredictionRequest):

    input_data = pd.DataFrame([
        {
            "centre_id": data.centre_id,
            "centre_name": data.centre_name,
            "tokens_ahead": data.tokens_ahead,
            "queue_length": data.queue_length,
            "active_counters": data.active_counters,
            "hour_of_day": data.hour_of_day,
            "day_of_week": data.day_of_week,
            "peak_hour": data.peak_hour,
            "crop": data.crop,
            "quantity_kg": data.quantity_kg,
            "quality_grade": data.quality_grade,
            "staff_experience_years": data.staff_experience_years,
            "processing_time_min": data.processing_time_min
        }
    ])

    prediction = model.predict(input_data)

    wait_time = float(prediction[0])

    wait_time = max(0, wait_time)

    return {
        "estimated_wait_time_minutes": round(
            wait_time,
            1
        )
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "message": "SIH ETA Prediction API is running"
    }