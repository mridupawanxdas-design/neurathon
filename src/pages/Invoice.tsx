import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

type InvoiceRow = { id: string; customer: string; amount: number; gst: boolean; gstAmount: number; total: number; status: string; createdAt: string };

export default function Invoice() {
  const [customer, setCustomer] = useState("Rahul Kumar");
  const [amount, setAmount] = useState("500");
  const [gst, setGst] = useState(true);
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<InvoiceRow[]>([]);

  const load = async () => {
    const { data } = await API.get("/invoices");
    setRows(data);
  };

  useEffect(() => { load().catch(() => undefined); }, []);

  const createInvoice = async () => {
    await API.post("/invoices", { customer, amount, gst });
    setStatus("Invoice entry added to Invoice Center.");
    load();
  };

  const generateInvoicePdf = async () => {
    try {
      const response = await API.post("/generate-invoice", { name: customer, amount, gst }, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${Date.now()}.pdf`);
      link.click();
      setStatus("Invoice PDF downloaded.");
      load();
    } catch {
      setStatus("Invoice generation failed. Ensure backend is running.");
    }
  };

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <Link to="/dashboard" className="text-sm text-muted-foreground">← Back to dashboard</Link>

        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-2xl font-display font-bold">Invoice Center</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create invoice records and download GST-compliant PDF.</p>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Customer name" />
              <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={gst} onChange={(e) => setGst(e.target.checked)} /> Apply GST (18%)</label>
              <div className="flex gap-2">
                <button className="rounded-xl border border-border px-4 py-2 text-sm" onClick={createInvoice}>Add to list</button>
                <button className="rounded-xl bg-green-gradient px-5 py-2.5 font-semibold text-primary-foreground" onClick={generateInvoicePdf}>Download PDF</button>
              </div>
              {status && <p className="text-sm text-muted-foreground">{status}</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
            <div className="mt-4 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2">Customer</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">GST</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/60">
                      <td className="py-2">{r.customer}</td>
                      <td className="py-2">₹ {r.amount.toFixed(2)}</td>
                      <td className="py-2">{r.gst ? `₹ ${r.gstAmount.toFixed(2)}` : "No"}</td>
                      <td className="py-2">₹ {r.total.toFixed(2)}</td>
                      <td className="py-2">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
