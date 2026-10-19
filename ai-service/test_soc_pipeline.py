
from detection.combined_detector import analyze_event
from rag.retriever import retrieve
from rag.gemini_client import generate_investigation


event = {
    "username": "analyst01",
    "source_ip": "192.0.2.50",
    "failed_logins": 12,
    "successful_login": 1,
    "unique_ips": 2,
    "unusual_hour": 1,
    "admin_action": 0,
}

print("\n=== CYBERSENTINEL AI: SOC PIPELINE ===")

result = analyze_event(event)

print("\nOverall Status:", result["overall_status"])
print("ML Prediction:", result["ml_prediction"])
print("ML Probability:", result["ml_probability"])

if result["overall_status"] != "suspicious":
    print("\nNo suspicious activity detected.")
    raise SystemExit

for alert in result["rule_alerts"]:
    print("\n=== SECURITY ALERT ===")
    print("Title:", alert["title"])
    print("Severity:", alert["severity"])
    print("Evidence:", alert["evidence"])

    query = (
        f"{alert['title']}. "
        f"Severity: {alert['severity']}. "
        f"Evidence: {alert['evidence']}. "
        "Explain the possible attack and recommend investigation steps."
    )

    try:
        results = retrieve(query)
        documents = results["documents"][0]

        if not documents:
            print("No relevant knowledge found in ChromaDB.")
            continue

        print("\n=== RETRIEVED KNOWLEDGE ===")
        for document in documents[:3]:
            print("-", document[:250])

        report = generate_investigation(query, documents)

        print("\n=== AI INVESTIGATION REPORT ===")
        print(report)

    except Exception as error:
        print("\nInvestigation failed:", error)
        print("Detection results remain available.")
