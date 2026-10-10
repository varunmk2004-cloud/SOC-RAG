from detection.ml_detector import predict_suspicious_activity

event = {
    "failed_logins": 12,
    "successful_login": 1,
    "unique_ips": 2,
    "unusual_hour": 1,
    "admin_action": 0,
}

print(predict_suspicious_activity(event))