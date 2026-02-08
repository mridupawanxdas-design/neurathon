import uuid
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from app.core.config import INVOICE_DIR

def generate_invoice(customer, base, tax, total):
    filename = f"{customer.replace(' ', '_')}_{uuid.uuid4().hex}.pdf"
    path = INVOICE_DIR / filename

    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(colors.teal)
    c.drawString(50, height - 50, "BHARAT BIZ-AGENT")

    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    c.drawString(50, height - 70, "Digital Khata | Secure Invoice")

    c.line(50, height - 80, width - 50, height - 80)

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 120, f"TAX INVOICE")

    y = height - 170
    c.setFont("Helvetica", 11)

    c.drawString(50, y, f"Customer : {customer}")
    y -= 30
    c.drawString(50, y, f"Base Amount : ₹ {base:.2f}")
    y -= 20
    c.drawString(50, y, f"GST Amount  : ₹ {tax:.2f}")
    y -= 30

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, f"TOTAL : ₹ {total:.2f}")

    c.save()
    return path, filename
