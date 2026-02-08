import sqlite3
from app.core.config import DB_PATH

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            base_amount REAL NOT NULL CHECK(base_amount >= 0),
            tax_amount REAL NOT NULL CHECK(tax_amount >= 0),
            total_amount REAL NOT NULL CHECK(total_amount >= 0),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
