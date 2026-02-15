import { Link } from "react-router-dom";

const features = [
  ["Invoice + GST", "Beautiful invoice PDF with GST toggle and quick download."],
  ["Udhaar Ledger", "Track customer credit, due amount, and print professional ledgers."],
  ["Inventory", "Live stock visibility with low-stock signals and reorder planning."],
  ["Multilingual AI", "English, Hinglish, Hindi, Telugu, Gujarati, Bangla, Tamil, Marathi."],
];

export default function Landing() {
  return (
    <div className="page" style={{ paddingTop: 40 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h2>Bharat Biz-Agent</h2>
        <Link to="/login" className="btn btn-primary">Try Biz Agent</Link>
      </header>

      <section className="glass" style={{ padding: 34 }}>
        <p style={{ color: "#86efac", fontWeight: 700 }}>Built for Indian Businesses</p>
        <h1 style={{ fontSize: 56, lineHeight: 1.05, margin: "10px 0 18px" }}>Your Business.<br />One Conversation Away.</h1>
        <p style={{ color: "var(--muted)", maxWidth: 820, fontSize: 20 }}>
          Manage billing, GST, udhaar, and inventory through one smart business workspace.
          Corporate-grade UI, reliable backend endpoints, and smooth PDF workflows.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Link to="/login" className="btn btn-primary">Try Biz Agent</Link>
          <Link to="/dashboard" className="btn btn-ghost">View Demo Dashboard</Link>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 20, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
        {features.map(([title, desc]) => (
          <article className="glass" key={title} style={{ padding: 18 }}>
            <h3>{title}</h3>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>{desc}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
