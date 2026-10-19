
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from detection.combined_detector import analyze_event
from rag.retriever import retrieve
from rag.gemini_client import generate_investigation

app = FastAPI(
    title="CyberSentinel AI",
    description="AI-powered SOC threat detection and investigation API",
    version="1.0.0",
)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SecurityEvent(BaseModel):
    username: str = "unknown"
    source_ip: str = "unknown"
    failed_logins: int = Field(default=0, ge=0)
    successful_login: bool = False
    unique_ips: int = Field(default=1, ge=0)
    unusual_hour: int = Field(default=0, ge=0, le=1)
    admin_action: int = Field(default=0, ge=0, le=1)


@app.get("/health")
def health():
    return {"status": "ok", "service": "CyberSentinel AI"}


@app.post("/analyze")
def analyze(event: SecurityEvent):
    try:
        event_data = event.model_dump()
        result = analyze_event(event_data)

        response = {
            "status": result["overall_status"],
            "ml_prediction": result["ml_prediction"],
            "ml_probability": result["ml_probability"],
            "alerts": result["rule_alerts"],
            "investigation_report": None,
            "retrieved_knowledge": [],
        }

        if result["overall_status"] != "suspicious":
            return response

        alert_details = "\n".join(
            f"{alert['title']} ({alert['severity']}): "
            f"{alert['evidence']}"
            for alert in result["rule_alerts"]
        )

        query = (
            "Investigate a potentially suspicious security event. "
            f"Username: {event.username}. "
            f"Source IP: {event.source_ip}. "
            f"Failed logins: {event.failed_logins}. "
            f"Successful login: {event.successful_login}. "
            f"Unique IPs: {event.unique_ips}. "
            f"Unusual hour: {event.unusual_hour}. "
            f"Admin action: {event.admin_action}. "
            f"ML prediction: {result['ml_prediction']}. "
            f"ML suspicious probability: {result['ml_probability']}. "
            f"Rule alerts: {alert_details}. "
            "Explain the evidence, uncertainty, relevant attack techniques, "
            "and recommended investigation steps."
        )

        documents = retrieve(query)["documents"][0]
        response["retrieved_knowledge"] = documents[:3]

        if documents:
            try:
                response["investigation_report"] = (
                    generate_investigation(query, documents)
                )
            except Exception:
                response["investigation_error"] = (
                    "AI report generation failed. Detection results "
                    "and retrieved knowledge are still available."
                )
        else:
            response["investigation_error"] = (
                "No relevant knowledge was retrieved."
            )

        return response

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {type(error).__name__}",
        ) from error
