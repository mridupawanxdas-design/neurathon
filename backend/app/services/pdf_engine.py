from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import mm
from datetime import datetime
import uuid
from app.core.config import INVOICE_DIR

def generate_invoice(customer, items, subtotal, gst_percent, gst_amount, total):
    filename = f"INV_{uuid.uuid4().hex}.pdf"
    path = INVOICE_DIR / filename

    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4

    # HEADER
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(30, height - 40, "BHARAT BIZ-AGENT")

    c.setFont("Helvetica", 9)
    c.drawString(30, height - 55, "Digital Invoice System")

    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(width - 30, height - 40, "TAX INVOICE")

    # META
    c.setFont("Helvetica", 9)
    c.drawString(30, height - 80, f"Customer: {customer}")
    c.drawRightString(width - 30, height - 80, f"Date: {datetime.now().strftime('%d-%m-%Y')}")

    # TABLE HEADER
    y = height - 120
    c.setFillColor(colors.lightgrey)
    c.rect(30, y, width - 60, 20, fill=1)
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 10)

    c.drawString(40, y + 6, "Item")
    c.drawRightString(width - 150, y + 6, "Amount")

    # ITEMS
    c.setFont("Helvetica", 10)
    y -= 20
    for item in items:
        c.drawString(40, y + 6, item["name"])
        c.drawRightString(width - 150, y + 6, f"₹ {item['price']:.2f}")
        y -= 18

    # TOTALS
    y -= 10
    c.line(width - 200, y, width - 30, y)

    c.drawRightString(width - 150, y - 20, "Subtotal")
    c.drawRightString(width - 30, y - 20, f"₹ {subtotal:.2f}")

    c.drawRightString(width - 150, y - 40, f"GST ({gst_percent}%)")
    c.drawRightString(width - 30, y - 40, f"₹ {gst_amount:.2f}")

    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(width - 150, y - 65, "TOTAL")
    c.drawRightString(width - 30, y - 65, f"₹ {total:.2f}")

    # FOOTER
    c.setFont("Helvetica", 8)
    c.drawCentredString(width / 2, 30, "Thank you for your business!")

    c.save()
    return path, filename
