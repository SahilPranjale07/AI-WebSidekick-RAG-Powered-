from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from services.scraper import scrape_url
from services.pdf_parser import extract_pdf_text
from services.embedder import chunk_and_index

router = APIRouter()

@router.post("/ingest/url")
async def ingest_url(url: str = Form(...)):
    """Scrape a URL and index it."""
    try:
        text = scrape_url(url)
        count = chunk_and_index(text)
        return {"status": "success", "chunks_indexed": count, "source": url}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ingest/pdf")
async def ingest_pdf(file: UploadFile = File(...)):
    """Upload a PDF and index it."""
    try:
        content = await file.read()
        text = extract_pdf_text(content)
        count = chunk_and_index(text)
        return {"status": "success", "chunks_indexed": count, "filename": file.filename}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
