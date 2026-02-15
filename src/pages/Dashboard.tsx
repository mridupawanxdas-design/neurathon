import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

type ChatMsg = { role: "user" | "assistant"; text: string };
const langs = ["english", "hinglish", "hindi", "telugu", "gujarati", "bangla", "tamil", "marathi"];

export default function Dashboard() {
  const [summary, setSummary] = useState({ invoices: 0, revenue: 0, udhaarOutstanding: 0, lowStock: 0 });
  const [message, setMessage] = useState("Rahul ke liye 500 ka bill bana do");
  const [language, setLanguage] = useState("hinglish");
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "assistant", text: "Namaste! I can help with invoice, udhaar ledger, and inventory updates." },
  ]);

  const refresh = () => API.get("/dashboard/summary").then((res) => setSummary(res.data)).catch(() => undefined);
  useEffect(() => { refresh(); }, []);

  const send = async () => {
    if (!message.trim()) return;
    setChat((prev) => [...prev, { role: "user", text: message }]);
    const userMessage = message;
    setMessage("");
    const { data } = await API.post("/chat", { message: userMessage, language });
    setChat((prev) => [...prev, { role: "assistant", text: data.reply }]);
    if (data.summary) setSummary(data.summary);
  };

  const cards = useMemo(() => [
    ["Invoices", summary.invoices],
    ["Revenue", `₹ ${summary.revenue.toFixed(2)}`],
    ["Udhaar Outstanding", `₹ ${summary.udhaarOutstanding.toFixed(2)}`],
    ["Low Stock", summary.lowStock],
  ], [summary]);

  return (
    <main className="min-h-screen bg-background py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Business Command Center</h1>
            <p className="text-sm text-muted-foreground">Navigate sections and run full demo actions with preloaded data.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-xl border border-border px-4 py-2 text-sm" to="/invoice">Invoice Center</Link>
            <Link className="rounded-xl border border-border px-4 py-2 text-sm" to="/udhaar">Udhaar Ledger</Link>
            <Link className="rounded-xl border border-border px-4 py-2 text-sm" to="/inventory">Inventory</Link>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([k, v]) => (
            <article key={String(k)} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{k}</p>
              <h3 className="mt-2 text-2xl font-semibold">{v}</h3>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold">Working Multilingual Chat Interface</h2>
          <p className="mt-1 text-sm text-muted-foreground">Example chat style like your mockup, plus section-based operations.</p>

          <div className="mt-4 h-80 space-y-3 overflow-auto rounded-xl border border-border bg-background p-3">
            {chat.map((item, idx) => (
              <div key={`${item.role}-${idx}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${item.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
            <input className="rounded-xl border border-input bg-background px-3 py-2.5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type or paste a command..." />
            <select className="rounded-xl border border-input bg-background px-3 py-2.5" value={language} onChange={(e) => setLanguage(e.target.value)}>
              {langs.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <button className="rounded-xl bg-green-gradient px-5 py-2.5 font-semibold text-primary-foreground" onClick={send}>Send</button>
          </div>
        </section>
      </div>
    </main>
  );
}
