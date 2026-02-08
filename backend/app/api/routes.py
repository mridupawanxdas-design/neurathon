from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.core.database import get_db
from app.models.schemas import RecordCreate
from app.services.pdf_engine import generate_invoice

router = APIRouter()

@router.get("/try-biz-agent")
def try_biz_agent():
    return {
        "status": "ready",
        "demo_video": "/static/demo.mp4"
    }

@router.get("/load-demo")
def load_demo():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("DELETE FROM records")

    demo = [
        ("BILL", "Sharma Trading Co", 2000, 360, 2360, "Demo Bill"),
        ("UDHAAR", "Rahul Sharma", 500, 0, 500, "Demo Udhaar")
    ]

    cur.executemany("""
        INSERT INTO records
        (category, customer_name, base_amount, tax_amount, total_amount, notes)
        VALUES (?,?,?,?,?,?)
    """, demo)

    conn.commit()
    conn.close()

    return {"status": "demo_loaded"}

@router.post("/add-record")
def add_record(record: RecordCreate):
    total = record.base_amount + record.tax_amount

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO records
        (category, customer_name, base_amount, tax_amount, total_amount, notes)
        VALUES (?,?,?,?,?,?)
    """, (
        record.category.upper(),
        record.customer_name.strip(),
        record.base_amount,
        record.tax_amount,
        total,
        record.notes
    ))

    conn.commit()
    conn.close()

    return {"status": "saved", "total": total}

@router.get("/view-khata")
def view_khata():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM records ORDER BY created_at DESC"
    ).fetchall()
    conn.close()

    return [dict(r) for r in rows]

@router.get("/generate-invoice")
def generate_invoice_api(customer_name: str):
    conn = get_db()
    row = conn.execute("""
        SELECT * FROM records
        WHERE customer_name=?
        ORDER BY created_at DESC
        LIMIT 1
    """, (customer_name.strip(),)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(404, "Customer not found")

    path, filename = generate_invoice(
        row["customer_name"],
        row["base_amount"],
        row["tax_amount"],
        row["total_amount"]
    )

    return FileResponse(path, filename=filename)
