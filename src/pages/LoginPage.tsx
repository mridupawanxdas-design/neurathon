import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 80 }}>
      <h2>Login</h2>

      <button
        style={{ marginTop: 20 }}
        onClick={() => navigate("/dashboard")}
      >
        Continue as Guest
      </button>
    </div>
  );
}
