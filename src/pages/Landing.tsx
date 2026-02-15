import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 80 }}>
      <h1>Biz Agent</h1>
      <p>Smart business automation</p>

      <button
        style={{ marginTop: 30, padding: "12px 20px" }}
        onClick={() => navigate("/login")}
      >
        Try Biz Agent
      </button>
    </div>
  );
}
