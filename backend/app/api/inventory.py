from fastapi import APIRouter
from app.core.database import get_db

inventory_router = APIRouter(prefix="/inventory")

@inventory_router.post("/add")
def add_item(name: str, qty: int, buy: float, sell: float):
    conn = get_db()
    conn.execute("""
    INSERT INTO inventory (item_name, quantity, buy_price, sell_price)
    VALUES (?,?,?,?)
    """, (name.strip(), qty, buy, sell))
    conn.commit()
    conn.close()
    return {"status": "item added"}

@inventory_router.get("/all")
def all_items():
    conn = get_db()
    rows = conn.execute("SELECT * FROM inventory").fetchall()
    conn.close()
    return [dict(r) for r in rows]
