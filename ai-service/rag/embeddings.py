from sentence_transformers import SentenceTransformer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def embed_documents(documents):
    return model.encode(
        documents,
        normalize_embeddings=True
    ).tolist()


def embed_query(query):
    return model.encode(
        query,
        normalize_embeddings=True
    ).tolist()