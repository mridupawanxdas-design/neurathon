import sqlite3
from pathlib import Path

DB_PATH = Path("biz.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    # Records (Bills)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        customer_name TEXT,
        base_amount REAL,
        tax_amount REAL,
        total_amount REAL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Udhaar
    cur.execute("""
    CREATE TABLE IF NOT EXISTS udhaar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        amount REAL,
        reason TEXT,
        given_on DATE DEFAULT CURRENT_DATE
    )
    """)

    # Inventory
    cur.execute("""
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT,
        quantity INTEGER,
        buy_price REAL,
        sell_price REAL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()
