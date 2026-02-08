from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DB_PATH = BASE_DIR / "biz.db"
STATIC_DIR = BASE_DIR / "static"
INVOICE_DIR = BASE_DIR / "invoices"

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DB_PATH = BASE_DIR / "biz.db"
STATIC_DIR = BASE_DIR / "static"
INVOICE_DIR = BASE_DIR / "invoices"

# Windows-safe directory creation
for directory in (STATIC_DIR, INVOICE_DIR):
    if not directory.exists():
        directory.mkdir(parents=True, exist_ok=True)
