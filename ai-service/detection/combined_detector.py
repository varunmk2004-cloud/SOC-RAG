
from detection.rule_engine import detect_suspicious_activity
from detection.ml_detector import predict_suspicious_activity


def analyze_event(event):
    rule_alerts = detect_suspicious_activity(event)
    ml_result = predict_suspicious_activity(event)

    return {
        "rule_alerts": rule_alerts,
        "ml_prediction": ml_result["prediction"],
        "ml_probability": ml_result["suspicious_probability"],
        "overall_status": (
            "suspicious"
            if rule_alerts or ml_result["prediction"] == "suspicious"
            else "benign"
        ),
    }
