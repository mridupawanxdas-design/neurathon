from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.core.database import get_db
from app.services.pdf_invoice import generate_invoice
from app.nlp.parser import parse_text

router = APIRouter()


@router.get("/try-biz-agent")
def try_biz_agent():
    return {"status": "ready"}


@router.post("/add-record")
def add_record(name: str, amount: float, gst: bool = True):
    name = name.strip()
    tax = amount * 0.18 if gst else 0.0
    total = amount + tax

    conn = get_db()
    conn.execute(
        """
        INSERT INTO records (category, customer_name, base_amount, tax_amount, total_amount)
        VALUES (?, ?, ?, ?, ?)
        """,
        ("BILL", name, amount, tax, total),
    )
    conn.commit()
    conn.close()

    return {"status": "saved", "total": total}


@router.post("/add-record-ai")
def add_record_ai(text: str):
    data = parse_text(text)

    conn = get_db()
    conn.execute(
        """
        INSERT INTO records (category, customer_name, base_amount, tax_amount, total_amount, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            "BILL",
            data["name"],
            data["base"],
            data["tax"],
            data["total"],
            text,
        ),
    )
    conn.commit()
    conn.close()

    return data


@router.get("/generate-invoice")
def generate_invoice_api(name: str):
    name = name.strip().lower()

    conn = get_db()
    row = conn.execute(
        """
        SELECT *
        FROM records
        WHERE LOWER(TRIM(customer_name)) = ?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (name,),
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="No record found")

    path, filename = generate_invoice(
        row["customer_name"],
        row["base_amount"],
        row["tax_amount"],
        row["total_amount"],
    )

    return FileResponse(path, filename=filename, media_type="application/pdf")
