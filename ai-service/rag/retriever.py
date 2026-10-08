from rag.embeddings import embed_query
from rag.vector_store import search


def retrieve(query, top_k=3):

    query_embedding = embed_query(query)

    results = search(
        query_embedding,
        top_k
    )

    return results