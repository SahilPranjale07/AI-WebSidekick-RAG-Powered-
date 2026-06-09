from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ingest import router as ingest_router
from routes.chat import router as chat_router

app = FastAPI(title="AI Chatbot Widget API", version="1.0.0", docs_url=None, redoc_url=None)

# Allow React frontend to call this API (enable CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_router)
app.include_router(chat_router)

import os
from services.embedder import INDEX_FILE, CHUNKS_FILE

@app.get("/")
def root():
    return {"message": "AI Chatbot Widget API is running"}

@app.get("/index-status")
def get_index_status():
    exists = os.path.exists(INDEX_FILE) and os.path.exists(CHUNKS_FILE)
    return {"exists": exists}
