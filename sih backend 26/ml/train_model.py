import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ============================================================
# 1. LOAD DATASET
# ============================================================

DATA_PATH = "dataset/sih_queue_wait_time_dataset_2000.csv"

df = pd.read_csv(DATA_PATH)

print("=" * 60)
print("DATASET LOADED")
print("=" * 60)

print("Number of rows:", len(df))
print("Number of columns:", len(df.columns))

print("\nColumns:")
print(df.columns.tolist())


# ============================================================
# 2. REMOVE UNNECESSARY COLUMNS
# ============================================================

# These columns are not available when we need to predict ETA.
#
# We must avoid target leakage.
#
# actual_wait_time_min = TARGET
#
# estimated_time_min is already an estimate, so we don't use it.
# service_start_time and service_end_time happen after the waiting.
# total_time_at_centre_min also happens after the process.

columns_to_remove = [
    "customer_id",
    "customer_name",
    "booking_date",
    "arrival_time",
    "token_number",
    "estimated_time_min",
    "actual_wait_time_min",
    "service_start_time",
    "service_end_time",
    "total_time_at_centre_min"
]


# ============================================================
# 3. TARGET
# ============================================================

TARGET = "actual_wait_time_min"

X = df.drop(columns=columns_to_remove)
y = df[TARGET]


print("\n" + "=" * 60)
print("FEATURES")
print("=" * 60)

print(X.columns.tolist())

print("\nTarget:")
print(TARGET)


# ============================================================
# 4. IDENTIFY CATEGORICAL AND NUMERICAL FEATURES
# ============================================================

categorical_features = [
    "centre_id",
    "centre_name",
    "crop",
    "quality_grade"
]

numerical_features = [
    "tokens_ahead",
    "queue_length",
    "active_counters",
    "hour_of_day",
    "day_of_week",
    "peak_hour",
    "quantity_kg",
    "staff_experience_years",
    "processing_time_min"
]


# ============================================================
# 5. PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),

        (
            "numerical",
            "passthrough",
            numerical_features
        )
    ]
)


# ============================================================
# 6. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)


print("\n" + "=" * 60)
print("DATA SPLIT")
print("=" * 60)

print("Training rows:", len(X_train))
print("Testing rows:", len(X_test))


# ============================================================
# 7. RANDOM FOREST MODEL
# ============================================================

random_forest = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),

        (
            "model",
            RandomForestRegressor(
                n_estimators=300,
                max_depth=20,
                min_samples_split=4,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            )
        )
    ]
)


print("\n" + "=" * 60)
print("TRAINING RANDOM FOREST")
print("=" * 60)

random_forest.fit(
    X_train,
    y_train
)


# ============================================================
# 8. PREDICTIONS
# ============================================================

rf_predictions = random_forest.predict(X_test)


# ============================================================
# 9. RANDOM FOREST EVALUATION
# ============================================================

rf_mae = mean_absolute_error(
    y_test,
    rf_predictions
)

rf_rmse = np.sqrt(
    mean_squared_error(
        y_test,
        rf_predictions
    )
)

rf_r2 = r2_score(
    y_test,
    rf_predictions
)


print("\n" + "=" * 60)
print("RANDOM FOREST RESULTS")
print("=" * 60)

print(f"MAE  : {rf_mae:.2f} minutes")
print(f"RMSE : {rf_rmse:.2f} minutes")
print(f"R²   : {rf_r2:.4f}")


# ============================================================
# 10. GRADIENT BOOSTING MODEL
# ============================================================

gradient_boosting = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),

        (
            "model",
            GradientBoostingRegressor(
                n_estimators=300,
                learning_rate=0.05,
                max_depth=5,
                min_samples_split=4,
                random_state=42
            )
        )
    ]
)


print("\n" + "=" * 60)
print("TRAINING GRADIENT BOOSTING")
print("=" * 60)

gradient_boosting.fit(
    X_train,
    y_train
)


# ============================================================
# 11. GRADIENT BOOSTING PREDICTIONS
# ============================================================

gb_predictions = gradient_boosting.predict(
    X_test
)


# ============================================================
# 12. GRADIENT BOOSTING EVALUATION
# ============================================================

gb_mae = mean_absolute_error(
    y_test,
    gb_predictions
)

gb_rmse = np.sqrt(
    mean_squared_error(
        y_test,
        gb_predictions
    )
)

gb_r2 = r2_score(
    y_test,
    gb_predictions
)


print("\n" + "=" * 60)
print("GRADIENT BOOSTING RESULTS")
print("=" * 60)

print(f"MAE  : {gb_mae:.2f} minutes")
print(f"RMSE : {gb_rmse:.2f} minutes")
print(f"R²   : {gb_r2:.4f}")


# ============================================================
# 13. SELECT BEST MODEL
# ============================================================

if rf_mae <= gb_mae:

    best_model = random_forest
    best_model_name = "Random Forest"
    best_mae = rf_mae
    best_rmse = rf_rmse
    best_r2 = rf_r2

else:

    best_model = gradient_boosting
    best_model_name = "Gradient Boosting"
    best_mae = gb_mae
    best_rmse = gb_rmse
    best_r2 = gb_r2


# ============================================================
# 14. SAVE BEST MODEL
# ============================================================

MODEL_PATH = "eta_model.joblib"

joblib.dump(
    best_model,
    MODEL_PATH
)


# ============================================================
# 15. FINAL RESULT
# ============================================================

print("\n" + "=" * 60)
print("BEST MODEL")
print("=" * 60)

print("Model:", best_model_name)
print(f"MAE  : {best_mae:.2f} minutes")
print(f"RMSE : {best_rmse:.2f} minutes")
print(f"R²   : {best_r2:.4f}")

print("\nModel saved as:")
print(MODEL_PATH)

print("\nTraining completed successfully!")