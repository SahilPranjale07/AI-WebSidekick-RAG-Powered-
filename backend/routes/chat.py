from fastapi import APIRouter
from pydantic import BaseModel
from services.rag_chain import answer_question

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(request: ChatRequest):
    """Answer a question using RAG."""
    result = answer_question(request.question)
    return result
