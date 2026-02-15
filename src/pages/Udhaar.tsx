import { useState } from "react";
import API from "../api";

export default function Udhaar() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const generateUdhaar = async () => {
    const response = await API.post("/generate-udhaar", {
      name,
      amount,
      reason,
    }, { responseType: "blob" });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "udhaar.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Udhaar</h2>

      <input placeholder="Person Name" onChange={(e)=>setName(e.target.value)} />
      <br /><br />

      <input placeholder="Amount" onChange={(e)=>setAmount(e.target.value)} />
      <br /><br />

      <input placeholder="Reason" onChange={(e)=>setReason(e.target.value)} />
      <br /><br />

      <button onClick={generateUdhaar}>Download Udhaar PDF</button>
    </div>
  );
}
