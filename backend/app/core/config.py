from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DB_PATH = BASE_DIR / "biz.db"
STATIC_DIR = BASE_DIR / "static"
INVOICE_DIR = BASE_DIR / "invoices"

STATIC_DIR.mkdir(exist_ok=True)
INVOICE_DIR.mkdir(exist_ok=True)
