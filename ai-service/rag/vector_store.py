import chromadb

client=chromadb.PersistentClient(
    path="./chroma_data"
)

collection = client.get_or_create_collection(
    name="cybersecurity_knowledge"
)

def add_documents(documents, embeddings, ids, metadatas):
    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas
    )

def search(query_embedding, top_k=5):
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    