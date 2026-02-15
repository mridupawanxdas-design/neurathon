import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 60 }}>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("/invoice")}>Invoice</button>
      <br /><br />
      <button onClick={() => navigate("/udhaar")}>Udhaar</button>
      <br /><br />
      <button onClick={() => navigate("/inventory")}>Inventory</button>
    </div>
  );
}
