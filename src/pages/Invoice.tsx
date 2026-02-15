import { useState } from "react";
import API from "../api";

export default function Invoice() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [gst, setGst] = useState(false);

  const generateInvoice = async () => {
    const response = await API.post("/generate-invoice", {
      name,
      amount,
      gst,
    }, { responseType: "blob" });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Invoice</h2>

      <input
        placeholder="Customer Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />

      <label>
        <input
          type="checkbox"
          onChange={(e) => setGst(e.target.checked)}
        />
        Apply GST
      </label>
      <br /><br />

      <button onClick={generateInvoice}>Download PDF</button>
    </div>
  );
}
