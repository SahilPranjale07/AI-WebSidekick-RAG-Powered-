import os
from openai import OpenAI
from services.embedder import search_similar_chunks
from dotenv import load_dotenv

# Load environment variables
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BACKEND_DIR, ".env"))

def get_openai_client():
    api_key = os.getenv("GROK_API_KEY")
    base_url = os.getenv("GROK_BASE_URL", "https://api.x.ai/v1")
    return OpenAI(api_key=api_key, base_url=base_url)

def answer_question(question: str) -> dict:
    """Run RAG: retrieve context, then generate answer with Grok."""
    relevant_chunks = search_similar_chunks(question, top_k=3)
    
    # If no data has been ingested yet
    if not relevant_chunks:
        return {
            "answer": "I don't have any website or PDF content indexed yet. Please load a URL or PDF first!",
            "sources": []
        }
        
    context = "\n\n".join(relevant_chunks)
    
    api_key = os.getenv("GROK_API_KEY")
    if not api_key or api_key == "your_grok_api_key_here" or api_key.strip() == "":
        return {
            "answer": "⚠️ [Configuration Warning] Please configure your actual `GROK_API_KEY` in `backend/.env` to query the LLM. Currently, I successfully retrieved the following relevant context chunks:\n\n" + "\n\n".join([f"- Chunk {i+1}: {c}" for i, c in enumerate(relevant_chunks)]),
            "sources": relevant_chunks
        }
        
    system_prompt = """You are a helpful assistant for a business website.
Answer the user's question using ONLY the context provided below.
If the answer is not in the context, say 'I don't have that information.'
Be concise and friendly."""
    
    user_message = f"""Context:
{context}

Question: {question}"""
    
    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model=os.getenv("GROK_MODEL", "grok-3"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=500
        )
        return {
            "answer": response.choices[0].message.content,
            "sources": relevant_chunks
        }
    except Exception as e:
        return {
            "answer": f"Error calling Grok LLM: {str(e)}\n\n(Retrieved context chunks were: {len(relevant_chunks)})",
            "sources": relevant_chunks
        }
