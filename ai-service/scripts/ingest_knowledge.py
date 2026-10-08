from pathlib import Path

from rag.embeddings import embed_documents
from rag.vector_store import add_documents


knowledge_path = Path("knowledge")

documents = []
ids = []
metadatas = []


for file in knowledge_path.rglob("*.md"):
    text = file.read_text(encoding="utf-8")

    documents.append(text)
    ids.append(file.stem)
    metadatas.append({
        "source": str(file),
        "category": file.parent.name
    })


embeddings = embed_documents(documents)

add_documents(
    documents,
    embeddings,
    ids,
    metadatas
)

print(f"Indexed {len(documents)} documents.")