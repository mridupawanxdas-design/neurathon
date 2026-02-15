import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Invoice from "./pages/Invoice";
import Udhaar from "./pages/Udhaar";
import Inventory from "./pages/Inventory";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/udhaar" element={<Udhaar />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  );
}
