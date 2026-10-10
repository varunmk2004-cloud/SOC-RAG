
from detection.rule_engine import detect_suspicious_activity

sample_log = {
    "username": "analyst01",
    "source_ip": "192.0.2.50",
    "failed_logins": 12,
    "successful_login": True
}

alerts = detect_suspicious_activity(sample_log)

if alerts:
    for alert in alerts:
        print("\n--- SECURITY ALERT ---")
        for key, value in alert.items():
            print(f"{key}: {value}")
else:
    print("No suspicious activity detected.")
