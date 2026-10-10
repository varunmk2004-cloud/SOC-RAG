
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "datasets" / "security_events.csv"
MODEL_DIR = BASE_DIR / "models" / "trained"
MODEL_PATH = MODEL_DIR / "random_forest.joblib"

FEATURES = [
    "failed_logins",
    "successful_login",
    "unique_ips",
    "unusual_hour",
    "admin_action",
]


def main():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    X = df[FEATURES]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    print("=== MODEL EVALUATION ===")
    print(classification_report(y_test, predictions, zero_division=0))

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {"model": model, "features": FEATURES},
        MODEL_PATH,
    )
    print(f"Model saved to: {MODEL_PATH}")


if __name__ == "__main__":
    main()
