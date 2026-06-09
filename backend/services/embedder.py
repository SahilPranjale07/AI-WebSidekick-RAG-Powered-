import os
import faiss
import pickle
import numpy as np
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

# Resolve vector store paths relative to the backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VECTOR_STORE_PATH = os.path.join(BACKEND_DIR, "vector_store")
INDEX_FILE = os.path.join(VECTOR_STORE_PATH, "index.faiss")
CHUNKS_FILE = os.path.join(VECTOR_STORE_PATH, "chunks.pkl")

# Load embedding model once (runs locally, no API cost)
# We load it lazily when needed so startup is faster
_embedder = None

def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedder

def chunk_and_index(text: str):
    """Split text into chunks and store in FAISS."""
    os.makedirs(VECTOR_STORE_PATH, exist_ok=True)
    
    # Split text into overlapping chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)
    
    if not chunks:
        raise ValueError("No text content found to index.")
    
    # Create embeddings
    embedder = get_embedder()
    embeddings = embedder.encode(chunks, show_progress_bar=False)
    embeddings = np.array(embeddings).astype("float32")
    
    # Build FAISS index
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    
    # Save index and chunks
    faiss.write_index(index, INDEX_FILE)
    with open(CHUNKS_FILE, "wb") as f:
        pickle.dump(chunks, f)
    
    return len(chunks)

def search_similar_chunks(query: str, top_k: int = 3) -> list[str]:
    """Find the most relevant chunks for a query."""
    if not os.path.exists(INDEX_FILE) or not os.path.exists(CHUNKS_FILE):
        return []
        
    index = faiss.read_index(INDEX_FILE)
    with open(CHUNKS_FILE, "rb") as f:
        chunks = pickle.load(f)
    
    embedder = get_embedder()
    query_embedding = embedder.encode([query]).astype("float32")
    _, indices = index.search(query_embedding, top_k)
    
    return [chunks[i] for i in indices[0] if i < len(chunks) and i >= 0]
