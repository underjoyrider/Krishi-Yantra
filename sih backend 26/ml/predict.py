import joblib
import pandas as pd
import os

# ============================================================
# LOAD TRAINED MODEL
# ============================================================

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "eta_model.joblib")

model = joblib.load(MODEL_PATH)


# ============================================================
# FUNCTION TO PREDICT WAITING TIME
# ============================================================

def predict_wait_time(
    centre_id,
    centre_name,
    tokens_ahead,
    queue_length,
    active_counters,
    hour_of_day,
    day_of_week,
    peak_hour,
    crop,
    quantity_kg,
    quality_grade,
    staff_experience_years,
    processing_time_min
):

    data = pd.DataFrame([
        {
            "centre_id": centre_id,
            "centre_name": centre_name,
            "tokens_ahead": tokens_ahead,
            "queue_length": queue_length,
            "active_counters": active_counters,
            "hour_of_day": hour_of_day,
            "day_of_week": day_of_week,
            "peak_hour": peak_hour,
            "crop": crop,
            "quantity_kg": quantity_kg,
            "quality_grade": quality_grade,
            "staff_experience_years": staff_experience_years,
            "processing_time_min": processing_time_min
        }
    ])

    prediction = model.predict(data)

    wait_time = float(prediction[0])

    # Don't show negative waiting time.
    wait_time = max(0, wait_time)

    return round(wait_time, 1)


# ============================================================
# TEST PREDICTION
# ============================================================

if __name__ == "__main__":

    result = predict_wait_time(
        centre_id="PC001",
        centre_name="Mysuru Central",
        tokens_ahead=12,
        queue_length=18,
        active_counters=3,
        hour_of_day=11,
        day_of_week=2,
        peak_hour=1,
        crop="Rice",
        quantity_kg=350,
        quality_grade="A",
        staff_experience_years=5,
        processing_time_min=10
    )

    print("\n===================================")
    print("ETA PREDICTION")
    print("===================================")

    print(
        f"Estimated waiting time: {result} minutes"
    )

    print("===================================")