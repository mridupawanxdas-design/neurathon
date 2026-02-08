import sqlite3
import os
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# ------------------ APP INIT ------------------

app = FastAPI(title="Bharat Biz-Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "biz.db")
INVOICE_DIR = os.path.join(BASE_DIR, "invoices")
STATIC_DIR = os.path.join(BASE_DIR, "static")

os.makedirs(INVOICE_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ------------------ DB UTILS ------------------

def get_db():
    return sqlite3.connect(DB_PATH, check_same_thread=False)

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            base_amount REAL NOT NULL,
            tax_amount REAL NOT NULL,
            total_amount REAL NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

# ------------------ SCHEMAS ------------------

class RecordIn(BaseModel):
    category: str
    customer_name: str
    base_amount: float
    tax_amount: float
    notes: str = ""

# ------------------ PDF ENGINE ------------------

def generate_invoice_pdf(customer, base, tax, total):
    filename = f"{customer}_{uuid.uuid4().hex}.pdf"
    path = os.path.join(INVOICE_DIR, filename)

    c = canvas.Canvas(path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(colors.teal)
    c.drawString(50, height - 50, "BHARAT BIZ-AGENT")

    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    c.drawString(50, height - 65, "Digital Khata | Verified Invoice")
    c.line(50, height - 75, width - 50, height - 75)

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 100, f"TAX INVOICE: {customer.upper()}")

    y = height - 140
    c.setFont("Helvetica", 11)

    c.drawString(50, y, f"Base Amount : ₹ {base:.2f}")
    y -= 25
    c.drawString(50, y, f"GST (18%)   : ₹ {tax:.2f}")
    y -= 25

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, f"TOTAL       : ₹ {total:.2f}")

    c.save()
    return path, filename

# ------------------ CORE ENDPOINTS ------------------

@app.get("/")
def root():
    return {
        "status": "Biz-Agent Online",
        "next": "Click 'Try Biz-Agent'"
    }

@app.get("/try-biz-agent")
def try_biz_agent():
    return {
        "message": "Biz-Agent initialized",
        "demo_video": "/static/demo.mp4",
        "actions": [
            "/load-demo",
            "/add-record",
            "/view-khata",
            "/generate-invoice"
        ]
    }

@app.get("/load-demo")
def load_demo():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM records")

    demo = [
        ("BILL", "Sharma Trading Co", 2000, 360, 2360, "Demo Bill"),
        ("UDHAAR", "Rahul Sharma", 500, 0, 500, "Demo Udhaar"),
    ]

    cursor.executemany("""
        INSERT INTO records
        (category, customer_name, base_amount, tax_amount, total_amount, notes)
        VALUES (?,?,?,?,?,?)
    """, demo)

    conn.commit()
    conn.close()

    return {"status": "Demo data loaded"}

@app.post("/add-record")
def add_record(record: RecordIn):
    total = record.base_amount + record.tax_amount

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
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
    return {"status": "Record added", "total": total}

@app.get("/view-khata")
def view_khata():
    conn = get_db()
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM records ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/generate-invoice")
def generate_invoice(customer_name: str):
    conn = get_db()
    conn.row_factory = sqlite3.Row

    row = conn.execute("""
        SELECT * FROM records
        WHERE customer_name=?
        ORDER BY created_at DESC
        LIMIT 1
    """, (customer_name.strip(),)).fetchone()

    conn.close()

    if not row:
        raise HTTPException(404, "Customer not found")

    path, filename = generate_invoice_pdf(
        row["customer_name"],
        row["base_amount"],
        row["tax_amount"],
        row["total_amount"]
    )

    return FileResponse(
        path,
        filename=filename,
        media_type="application/pdf"
    )
