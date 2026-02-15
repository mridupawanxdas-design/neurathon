import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

type UdhaarEntry = {
  id: string;
  name: string;
  amount: number;
  reason: string;
  takenAt: string;
  paidAmount: number;
  paidAt: string | null;
  status: string;
  outstanding: number;
};

type LedgerResp = {
  entries: UdhaarEntry[];
  summary: { totalGiven: number; totalPaid: number; totalOutstanding: number };
};

export default function Udhaar() {
  const [name, setName] = useState("Karan Stores");
  const [amount, setAmount] = useState("2500");
  const [reason, setReason] = useState("Pending wholesale payment");
  const [repay, setRepay] = useState<Record<string, string>>({});
  const [ledger, setLedger] = useState<LedgerResp>({ entries: [], summary: { totalGiven: 0, totalPaid: 0, totalOutstanding: 0 } });
  const [statusText, setStatusText] = useState("");

  const load = async () => {
    const { data } = await API.get("/udhaar/list");
    setLedger(data);
  };

  useEffect(() => { load().catch(() => undefined); }, []);

  const createUdhaarEntry = async () => {
    await API.post("/udhaar", { name, amount, reason });
    setStatusText("Udhaar entry added.");
    await load();
  };

  const generateUdhaarPdf = async () => {
    try {
      const response = await API.post("/generate-udhaar", { name, amount, reason }, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `udhaar-${Date.now()}.pdf`);
      link.click();
      setStatusText("Udhaar PDF downloaded.");
      await load();
    } catch {
      setStatusText("Failed to generate udhaar PDF. Ensure backend is running.");
    }
  };

  const recordPayment = async (id: string) => {
    const val = Number(repay[id] || 0);
    if (!val) return;
    await API.patch(`/udhaar/${id}/pay`, { amount: val });
    setRepay((s) => ({ ...s, [id]: "" }));
    await load();
  };

  const cards = useMemo(() => [
    ["Total Udhaar Given", ledger.summary.totalGiven],
    ["Paid Back", ledger.summary.totalPaid],
    ["Outstanding", ledger.summary.totalOutstanding],
  ], [ledger.summary]);

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <Link to="/dashboard" className="text-sm text-muted-foreground">← Back to dashboard</Link>

        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_2fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-2xl font-display font-bold">Udhaar Entry & PDF</h1>
            <p className="mt-1 text-sm text-muted-foreground">Add ledger row, reason, and create formal PDF record.</p>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="Borrower name" />
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
              <div className="flex gap-2">
                <button onClick={createUdhaarEntry} className="rounded-xl border border-border px-4 py-2 text-sm">Add Ledger Entry</button>
                <button onClick={generateUdhaarPdf} className="rounded-xl bg-green-gradient px-5 py-2.5 font-semibold text-primary-foreground">Download PDF</button>
              </div>
              {statusText && <p className="text-sm text-muted-foreground">{statusText}</p>}
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {cards.map(([k, v]) => (
                <article key={String(k)} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="mt-1 text-xl font-semibold">₹ {Number(v).toFixed(2)}</p>
                </article>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">Full Udhaar Ledger</h2>
              <div className="mt-4 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-2">Person</th>
                      <th className="py-2">Taken</th>
                      <th className="py-2">Reason</th>
                      <th className="py-2">Given</th>
                      <th className="py-2">Paid</th>
                      <th className="py-2">Outstanding</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.entries.map((x) => (
                      <tr key={x.id} className="border-b border-border/60">
                        <td className="py-2">{x.name}<div className="text-xs text-muted-foreground">{x.status}</div></td>
                        <td className="py-2">{new Date(x.takenAt).toLocaleDateString("en-IN")}</td>
                        <td className="py-2">{x.reason}</td>
                        <td className="py-2">₹ {x.amount.toFixed(2)}</td>
                        <td className="py-2">₹ {x.paidAmount.toFixed(2)}{x.paidAt ? <div className="text-xs text-muted-foreground">on {new Date(x.paidAt).toLocaleDateString("en-IN")}</div> : null}</td>
                        <td className="py-2">₹ {x.outstanding.toFixed(2)}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <input className="w-20 rounded-lg border border-input bg-background px-2 py-1" value={repay[x.id] || ""} onChange={(e) => setRepay((s) => ({ ...s, [x.id]: e.target.value }))} placeholder="pay" />
                            <button className="rounded-lg border border-border px-2 py-1" onClick={() => recordPayment(x.id)}>Record</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
