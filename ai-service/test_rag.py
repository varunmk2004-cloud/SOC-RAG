from rag.retriever import retrieve

query = """
Multiple failed login attempts followed by
a successful login. What should I investigate?
"""

results = retrieve(query)

for document in results["documents"][0]:
    print("\n--- DOCUMENT ---\n")
    print(document)