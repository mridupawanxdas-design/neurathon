import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

type Item = { id: string; name: string; quantity: number; threshold: number; unit: string; price: number };

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ name: "", quantity: "", threshold: "", unit: "pcs", price: "" });

  const load = async () => {
    const { data } = await API.get("/inventory");
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => undefined);
    const timer = setInterval(() => load().catch(() => undefined), 4000);
    return () => clearInterval(timer);
  }, []);

  const addItem = async () => {
    await API.post("/inventory", { ...form, quantity: Number(form.quantity), threshold: Number(form.threshold), price: Number(form.price) });
    setForm({ name: "", quantity: "", threshold: "", unit: "pcs", price: "" });
    load();
  };

  const updateQty = async (id: string, quantity: number) => {
    await API.patch(`/inventory/${id}`, { quantity });
    load();
  };

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <Link to="/dashboard" className="text-sm text-muted-foreground">← Back to dashboard</Link>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-2xl font-display font-bold">Add Inventory Item</h1>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" placeholder="Threshold" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} />
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <button className="rounded-xl bg-green-gradient px-5 py-2.5 font-semibold text-primary-foreground" onClick={addItem}>Add Item</button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Live Inventory Tracking</h2>
            <p className="text-sm text-muted-foreground">Auto-refresh every 4 seconds.</p>
            <div className="mt-4 space-y-3">
              {items.map((it) => {
                const low = it.quantity <= it.threshold;
                return (
                  <article key={it.id} className={`rounded-xl border p-3 ${low ? "border-red-500/40" : "border-border"}`}>
                    <p className="font-semibold">{it.name}</p>
                    <p className="text-sm text-muted-foreground">₹ {it.price} / {it.unit}</p>
                    <p className="mt-1 text-sm">Qty: {it.quantity} {low && <span className="text-red-400">(Low stock)</span>}</p>
                    <div className="mt-2 flex gap-2">
                      <button className="rounded-lg border border-border px-2 py-1 text-sm" onClick={() => updateQty(it.id, Math.max(0, it.quantity - 1))}>-1</button>
                      <button className="rounded-lg bg-green-gradient px-2 py-1 text-sm font-semibold text-primary-foreground" onClick={() => updateQty(it.id, it.quantity + 1)}>+1 Reorder</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
