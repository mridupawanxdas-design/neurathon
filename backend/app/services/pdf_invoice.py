from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime

INVOICE_DIR = Path("invoices")

# HARD SAFETY: if a file exists with same name, crash clearly
if INVOICE_DIR.exists() and not INVOICE_DIR.is_dir():
    raise RuntimeError("Path 'invoices' exists but is not a directory")

INVOICE_DIR.mkdir(parents=True, exist_ok=True)


def generate_invoice(name: str, base: float, tax: float, total: float):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"invoice_{name}_{timestamp}.pdf"
    path = INVOICE_DIR / filename

    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4

    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, "BHARAT BIZ-AGENT")

    c.setFont("Helvetica", 10)
    c.drawString(50, height - 70, "Smart Digital Khata & Invoice System")

    c.line(50, height - 80, width - 50, height - 80)

    # Customer info
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 120, f"Customer: {name}")

    c.setFont("Helvetica", 10)
    c.drawString(50, height - 140, f"Date: {datetime.now().strftime('%d-%m-%Y')}")

    # Table
    y = height - 200
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "Description")
    c.drawString(400, y, "Amount (INR)")

    c.line(50, y - 5, width - 50, y - 5)

    y -= 30
    c.setFont("Helvetica", 11)
    c.drawString(50, y, "Base Amount")
    c.drawString(400, y, f"{base:.2f}")

    y -= 25
    c.drawString(50, y, "GST")
    c.drawString(400, y, f"{tax:.2f}")

    y -= 25
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "TOTAL")
    c.drawString(400, y, f"{total:.2f}")

    c.showPage()
    c.save()

    return str(path), filename
