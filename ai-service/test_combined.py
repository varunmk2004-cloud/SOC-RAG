
from detection.combined_detector import analyze_event

event = {
    "username": "analyst01",
    "source_ip": "192.0.2.50",
    "failed_logins": 12,
    "successful_login": 1,
    "unique_ips": 2,
    "unusual_hour": 1,
    "admin_action": 0,
}

result = analyze_event(event)

print("\n=== CYBERSENTINEL AI ===")
print("Overall Status:", result["overall_status"])
print("ML Prediction:", result["ml_prediction"])
print("ML Probability:", result["ml_probability"])
print("\nRule Alerts:")

for alert in result["rule_alerts"]:
    print(alert)
