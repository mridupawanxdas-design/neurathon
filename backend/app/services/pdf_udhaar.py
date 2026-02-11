from reportlab.lib.pagesizes import A4
from reportlab.lib import colors

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

    primary_green = colors.HexColor("#355F55")
    light_bg = colors.HexColor("#E6F0EC")
    dark_text = colors.HexColor("#2A2A2A")

    # =========================
    # HEADER BAR
    # =========================
    c.setFillColor(primary_green)
    c.rect(0, h - 120, w, 120, fill=1)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(40, h - 75, "UDHAAR STATEMENT")

    c.setFont("Helvetica", 11)
    c.drawString(40, h - 100, "Digital Credit Record - Bharat Biz Agent")

    # =========================
    # CUSTOMER INFO BOX
    # =========================
    c.setFillColor(light_bg)
    c.rect(40, h - 190, w - 80, 50, fill=1)

    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(55, h - 165, f"Customer Name: {name}")

    # =========================
    # TABLE HEADER
    # =========================
    y = h - 230

    c.setFillColor(primary_green)
    c.rect(40, y, w - 80, 28, fill=1)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(55, y + 8, "DATE")
    c.drawString(140, y + 8, "AMOUNT")
    c.drawString(230, y + 8, "REASON")
    c.drawString(w - 140, y + 8, "PHONE")

    # =========================
    # TABLE CONTENT
    # =========================
    y -= 35
    c.setFont("Helvetica", 10)
    c.setFillColor(dark_text)

    total_amount = 0

    for r in rows:
        c.drawString(55, y, str(r['given_on']))
        c.drawString(140, y, f"₹ {r['amount']}")
        c.drawString(230, y, str(r['reason'])[:25])
        c.drawString(w - 140, y, str(r['phone']))

        total_amount += float(r['amount'])
        y -= 2
