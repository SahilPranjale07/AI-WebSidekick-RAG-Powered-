import fitz  # PyMuPDF

def extract_pdf_text(file_bytes: bytes) -> str:
    """Extract all text from a PDF file."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text = ""
    for page in doc:
        full_text += page.get_text() + "\n"
    
    # Clean up empty lines
    lines = [line.strip() for line in full_text.splitlines() if line.strip()]
    return "\n".join(lines)
