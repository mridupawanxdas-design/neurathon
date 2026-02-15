import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("owner@bizagent.in");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const persistSession = (data: unknown) => {
    localStorage.setItem("bizagent_session", JSON.stringify(data));
    navigate("/dashboard");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      persistSession(data);
    } catch {
      setError("Unable to sign in with those details.");
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = async () => {
    setLoading(true);
    const { data } = await API.post("/auth/guest");
    persistSession(data);
  };

  return (
    <main className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elevated">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to website</Link>
        <h1 className="mt-3 text-3xl font-display font-bold">Sign in to Bharat Biz-Agent</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use owner credentials or continue as guest to explore the full working demo.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-input bg-background px-3 py-2.5" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="w-full rounded-xl border border-input bg-background px-3 py-2.5" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-green-gradient px-4 py-2.5 font-semibold text-primary-foreground disabled:opacity-70">{loading ? "Please wait..." : "Sign in"}</button>
          <button type="button" disabled={loading} onClick={continueAsGuest} className="w-full rounded-xl border border-border px-4 py-2.5 font-semibold">Continue as guest</button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">Demo credentials are prefilled. No manual setup required.</p>
      </div>
    </main>
  );
}
