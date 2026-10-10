
from detection.rule_engine import detect_suspicious_activity
from rag.retriever import retrieve
from rag.gemini_client import generate_investigation


# 1. Simulated security log
log = {
    "username": "analyst01",
    "source_ip": "192.0.2.50",
    "failed_logins": 12,
    "successful_login": True
}

# 2. Detect suspicious activity
alerts = detect_suspicious_activity(log)

if not alerts:
    print("No suspicious activity detected.")
else:
    for alert in alerts:
        print("\n=== DETECTED ALERT ===")
        print(alert)

        # 3. Create a query from the alert
        query = (
            f"{alert['title']}. "
            f"Evidence: {alert['evidence']} "
            "What should the SOC analyst investigate?"
        )

        # 4. Retrieve relevant cybersecurity knowledge
        results = retrieve(query)
        documents = results["documents"][0]

        if not documents:
            print("No relevant knowledge retrieved.")
            continue

        # 5. Generate an investigation using Gemini
        try:
            report = generate_investigation(query, documents)
            print("\n=== INVESTIGATION REPORT ===")
            print(report)
        except Exception as error:
            print(f"Gemini request failed: {error}")
