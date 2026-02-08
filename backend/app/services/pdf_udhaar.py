from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from pathlib import Path
import uuid

UDHAAR_DIR = Path("udhaar_pdfs")
UDHAAR_DIR.mkdir(exist_ok=True)

def generate_udhaar_pdf(name, rows):
    filename = f"UDHAAR_{uuid.uuid4().hex}.pdf"
    path = UDHAAR_DIR / filename

    c = canvas.Canvas(str(path), pagesize=A4)
    w, h = A4

    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, h - 50, "UDHAAR STATEMENT")

    c.setFont("Helvetica", 11)
    c.drawString(40, h - 80, f"Name: {name}")

    y = h - 130
    for r in rows:
        c.drawString(40, y, f"{r['given_on']} | ₹{r['amount']} | {r['reason']} | {r['phone']}")
        y -= 20

    c.save()
    return path, filename
