
from pathlib import Path

import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "models" / "trained" / "random_forest.joblib"

bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
FEATURES = bundle["features"]


def predict_suspicious_activity(event):
    row = pd.DataFrame(
        [{feature: event[feature] for feature in FEATURES}]
    )

    prediction = int(model.predict(row)[0])
    probabilities = model.predict_proba(row)[0]

    suspicious_index = list(model.classes_).index(1)

    return {
        "prediction": (
            "suspicious" if prediction == 1 else "benign"
        ),
        "suspicious_probability": round(
            float(probabilities[suspicious_index]), 4
        ),
    }
