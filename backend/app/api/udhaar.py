from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.core.database import get_db
from app.services.pdf_udhaar import generate_udhaar_pdf

udhaar_router = APIRouter(prefix="/udhaar")

@udhaar_router.post("/add")
def add_udhaar(name: str, phone: str, amount: float, reason: str):
    conn = get_db()
    conn.execute("""
    INSERT INTO udhaar (name, phone, amount, reason)
    VALUES (?,?,?,?)
    """, (name.strip(), phone.strip(), amount, reason.strip()))
    conn.commit()
    conn.close()

    return {"status": "udhaar added"}

@udhaar_router.get("/pdf")
def download_udhaar(name: str):
    conn = get_db()
    rows = conn.execute("""
    SELECT * FROM udhaar
    WHERE LOWER(TRIM(name)) = ?
    """, (name.strip().lower(),)).fetchall()
    conn.close()

    path, filename = generate_udhaar_pdf(name, rows)
    return FileResponse(path, filename=filename)
