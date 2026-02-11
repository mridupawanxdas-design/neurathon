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

    primary_green = colors.HexColor("#4E6F63")
    light_bg = colors.HexColor("#E8ECE8")
    dark_text = colors.HexColor("#2F2F2F")

    # =========================
    # TOP GREEN HEADER BLOCK
    # =========================
    c.setFillColor(primary_green)
    c.rect(0, height - 140, width, 140, fill=1)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(50, height - 90, "Invoice")

    # Company / Logo Area
    c.setFont("Helvetica-Bold", 16)
    c.drawRightString(width - 50, height - 80, "BHARAT BIZ-AGENT")

    c.setFont("Helvetica", 10)
    c.drawRightString(width - 50, height - 100, "Smart Digital Khata & Invoice System")

    # =========================
    # BILL SECTION BACKGROUND
    # =========================
    c.setFillColor(light_bg)
    c.rect(40, height - 300, width - 80, 140, fill=1)

    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(60, height - 190, "Bill To:")

    c.setFont("Helvetica", 11)
    c.drawString(60, height - 210, name)

    c.drawString(60, height - 235, f"Date: {datetime.now().strftime('%d-%m-%Y')}")
    c.drawRightString(width - 60, height - 235, f"Invoice No: {timestamp}")

    # =========================
    # TABLE HEADER BAR
    # =========================
    y = height - 330

    c.setFillColor(primary_green)
    c.rect(40, y, width - 80, 30, fill=1)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(60, y + 10, "ITEM DESCRIPTION")
    c.drawRightString(width - 60, y + 10, "AMOUNT (INR)")

    # =========================
    # TABLE CONTENT AREA
    # =========================
    y -= 40
    c.setFillColor(light_bg)
    c.rect(40, y - 80, width - 80, 80, fill=1)

    c.setFillColor(dark_text)
    c.setFont("Helvetica", 11)

    c.drawString(60, y - 10, "Base Amount")
    c.drawRightString(width - 60, y - 10, f"{base:.2f}")

    c.drawString(60, y - 35, "GST")
    c.drawRightString(width - 60, y - 35, f"{tax:.2f}")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(60, y - 60, "TOTAL")
    c.drawRightString(width - 60, y - 60, f"{total:.2f}")

    # =========================
    # TOTAL BOX (Highlight)
    # =========================
    c.setFillColor(primary_green)
    c.rect(width - 260, y - 120, 200, 40, fill=1)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width - 160, y - 105, f"Total Amount: ₹ {total:.2f}")

    # =========================
    # FOOTER
    # =========================
    c.setFillColor(dark_text)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2, 100, "THANK YOU")

    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2, 80, "Please send payment within 15 days.")

    c.showPage()
    c.save()

    return str(path), filename
