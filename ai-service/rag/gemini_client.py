
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=api_key)


def generate_investigation(query, documents):
    context = "\n\n".join(documents)

    prompt = f"""
You are a cybersecurity SOC analyst assistant.

Use the supplied knowledge to investigate the alert.
Do not invent evidence or claim that an attack is confirmed
without sufficient evidence. Separate facts from hypotheses.

If the context is insufficient, say so.

CYBERSECURITY KNOWLEDGE:
{context}

ALERT / QUESTION:
{query}

Provide:
1. Incident assessment
2. Evidence available
3. Investigation steps
4. Relevant MITRE ATT&CK techniques, if supported
5. Recommended response
6. Missing evidence and uncertainty
"""

    response = client.models.generate_content(
        model=model_name,
        contents=prompt
    )

    return response.text
