
def detect_suspicious_activity(log):
    alerts = []

    failed = log.get("failed_logins", 0)
    successful = log.get("successful_login", False)
    username = log.get("username", "unknown")
    source_ip = log.get("source_ip", "unknown")

    # Rule 1: Multiple failed login attempts
    if failed >= 5:
        alerts.append({
            "rule_id": "BRUTE_FORCE",
            "title": "Possible Brute Force Attack",
            "severity": "HIGH",
            "username": username,
            "source_ip": source_ip,
            "evidence": f"{failed} failed login attempts detected."
        })

    # Rule 2: Successful login after repeated failures
    if failed >= 5 and successful:
        alerts.append({
            "rule_id": "BRUTE_FORCE_SUCCESS",
            "title": "Successful Login After Repeated Failures",
            "severity": "CRITICAL",
            "username": username,
            "source_ip": source_ip,
            "evidence": (
                f"{failed} failed attempts followed by "
                "a successful login."
            )
        })

    return alerts
