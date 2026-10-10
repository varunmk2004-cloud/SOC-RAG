from rag.retriever import retrieve
from rag.gemini_client import generate_investigation

query = """
Multiple failed login attempts followed by a successful login.
What should I investigate?
"""

results = retrieve(query)
documents = results["documents"][0]

if not documents:
    print("No relevant knowledge retrieved.")
else:
    answer = generate_investigation(query, documents)
    print("\n=== CYBERSENTINEL AI INVESTIGATION ===\n")
    print(answer)