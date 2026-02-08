import re

def parse_text(text: str):
    text = text.lower()

    amount_match = re.search(r'\d{2,7}', text)
    if not amount_match:
        raise ValueError("Amount not found")

    base = float(amount_match.group())
    gst = 18 if "gst" in text else 0
    tax = base * gst / 100

    name = text.split()[0].capitalize()

    return {
        "name": name.strip(),
        "base": base,
        "tax": tax,
        "total": base + tax
    }
