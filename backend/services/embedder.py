import os
import time
import faiss
import pickle
import requests
import numpy as np
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Resolve vector store paths relative to the backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VECTOR_STORE_PATH = os.path.join(BACKEND_DIR, "vector_store")
INDEX_FILE = os.path.join(VECTOR_STORE_PATH, "index.faiss")
CHUNKS_FILE = os.path.join(VECTOR_STORE_PATH, "chunks.pkl")

load_dotenv(os.path.join(BACKEND_DIR, ".env"))
HF_API_KEY = os.getenv("HF_API_KEY")

def get_embeddings(texts: list[str]) -> list[list[float]]:
    """Retrieve embeddings for a list of texts using Hugging Face Cloud Inference API."""
    api_url = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
    headers = {}
    if HF_API_KEY and HF_API_KEY.strip():
        headers["Authorization"] = f"Bearer {HF_API_KEY}"
    
    # Retry loop to handle model cold-starts/loading phase on Hugging Face
    for attempt in range(5):
        try:
            response = requests.post(api_url, headers=headers, json={"inputs": texts}, timeout=20)
            data = response.json()
            
            if response.status_code == 200:
                # API sometimes returns a single list for 1 item instead of a list of lists, normalize it
                if isinstance(data, list) and len(data) > 0 and not isinstance(data[0], list):
                    return [data]
                return data
                
            if isinstance(data, dict) and "currently loading" in data.get("error", ""):
                wait_time = min(data.get("estimated_time", 10), 10)
                time.sleep(wait_time)
                continue
                
            raise ValueError(f"Hugging Face API returned error {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            if attempt == 4:
                raise ValueError(f"Hugging Face connection failed: {str(e)}")
            time.sleep(2)
            
    raise TimeoutError("Hugging Face model took too long to load.")

def chunk_and_index(text: str):
    """Split text into chunks and store in FAISS using Cloud Embeddings."""
    os.makedirs(VECTOR_STORE_PATH, exist_ok=True)
    
    # Split text into overlapping chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)
    
    if not chunks:
        raise ValueError("No text content found to index.")
    
    # Get embeddings from HF cloud
    embeddings = get_embeddings(chunks)
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
    """Find the most relevant chunks for a query using Cloud Embeddings."""
    if not os.path.exists(INDEX_FILE) or not os.path.exists(CHUNKS_FILE):
        return []
        
    index = faiss.read_index(INDEX_FILE)
    with open(CHUNKS_FILE, "rb") as f:
        chunks = pickle.load(f)
    
    # Get query embedding from HF cloud
    query_embedding = get_embeddings([query])
    query_embedding = np.array(query_embedding).astype("float32")
    
    _, indices = index.search(query_embedding, top_k)
    
    return [chunks[i] for i in indices[0] if i < len(chunks) and i >= 0]
