import http from "http";
import { randomUUID } from "crypto";
import { URL } from "url";

const PORT = process.env.PORT || 8000;

const nowIso = () => new Date().toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

const db = {
  users: [{ id: "u-demo", email: "owner@bizagent.in", password: "demo123", name: "Business Owner" }],
  invoices: [
    { id: randomUUID(), customer: "Rahul Traders", amount: 5000, gst: true, gstAmount: 900, total: 5900, status: "sent", createdAt: daysAgo(3) },
    { id: randomUUID(), customer: "Neha Retail", amount: 2200, gst: false, gstAmount: 0, total: 2200, status: "paid", createdAt: daysAgo(1) },
  ],
  udhaar: [
    { id: randomUUID(), name: "Karan Stores", amount: 3000, reason: "Wholesale rice bags", takenAt: daysAgo(7), paidAmount: 1000, paidAt: daysAgo(2), status: "partial" },
    { id: randomUUID(), name: "Suman Kirana", amount: 1600, reason: "Emergency stock refill", takenAt: daysAgo(4), paidAmount: 0, paidAt: null, status: "pending" },
  ],
  inventory: [
    { id: randomUUID(), name: "Basmati Rice 25kg", quantity: 16, threshold: 8, unit: "bags", price: 1850 },
    { id: randomUUID(), name: "Sunflower Oil 1L", quantity: 6, threshold: 10, unit: "packs", price: 135 },
    { id: randomUUID(), name: "Sugar 5kg", quantity: 14, threshold: 6, unit: "bags", price: 260 },
  ],
};

const readJson = (req) =>
  new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });

const sendJson = (res, code, payload) => {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
  });
  res.end(JSON.stringify(payload));
};

const escapePdfText = (v) => String(v).replace(/[()\\]/g, "");

const generateStyledPdf = ({ invoiceId, customer, rows = [], totals = {} }) => {
  const today = new Date().toLocaleDateString("en-IN");
  const content = [];

  content.push("BT");
  content.push("/F1 26 Tf");
  content.push("40 800 Td");
  content.push("(INVOICE) Tj");

  content.push("0 -25 Td");
  content.push("/F1 10 Tf");
  content.push("(Biz-Agent Pvt Ltd) Tj");

  content.push("0 -15 Td");
  content.push("(New Delhi, India) Tj");

  content.push("0 -40 Td");
  content.push("/F1 12 Tf");
  content.push(`(Bill To: ${escapePdfText(customer)}) Tj`);

  content.push("0 -15 Td");
  content.push(`(Invoice No: ${invoiceId}) Tj`);

  content.push("0 -15 Td");
  content.push(`(Date: ${today}) Tj`);

  content.push("0 -40 Td");
  content.push("/F1 11 Tf");
  content.push("(Description                Amount) Tj");

  rows.forEach((r) => {
    content.push("0 -18 Td");
    content.push(`(${escapePdfText(r.label)}        ${escapePdfText(r.value)}) Tj`);
  });

  content.push("0 -30 Td");
  content.push("/F1 12 Tf");
  content.push(`(Subtotal: INR ${Number(totals.subtotal || 0).toFixed(2)}) Tj`);

  if (totals.gst) {
    content.push("0 -18 Td");
    content.push(`(GST 18%: INR ${Number(totals.gst).toFixed(2)}) Tj`);
  }

  content.push("0 -20 Td");
  content.push("/F1 14 Tf");
  content.push(`(TOTAL: INR ${Number(totals.total || 0).toFixed(2)}) Tj`);

  content.push("0 -40 Td");
  content.push("/F1 10 Tf");
  content.push("(Authorized Signature) Tj");

  content.push("ET");

  const stream = content.join("\n");

  const obj1 = "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n";
  const obj2 = "2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj\n";
  const obj3 =
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n";
  const obj4 = `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj\n`;
  const obj5 = "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n";

  const parts = [obj1, obj2, obj3, obj4, obj5];
  let cursor = 9;
  const offsets = [0];

  for (const p of parts) {
    offsets.push(cursor);
    cursor += Buffer.byteLength(p, "utf8");
  }

  const xref = `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((x) => `${String(x).padStart(10, "0")} 00000 n `)
    .join("\n")}\n`;

  const trailer = `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${cursor}\n%%EOF`;

  return Buffer.from(`%PDF-1.4\n${parts.join("")}${xref}${trailer}`, "utf8");
};

const recalcUdhaar = () => db.udhaar.map((x) => ({ ...x, outstanding: Math.max(0, x.amount - x.paidAmount) }));

const buildSummary = () => {
  const ledger = recalcUdhaar();
  const outstanding = ledger.reduce((s, x) => s + x.outstanding, 0);
  return {
    invoices: db.invoices.length,
    revenue: db.invoices.reduce((s, x) => s + x.total, 0),
    udhaarOutstanding: outstanding,
    lowStock: db.inventory.filter((x) => x.quantity <= x.threshold).length,
  };
};

const chatReply = (language, message) => {
  const map = {
    english: "Done. I updated your business workspace.",
    hinglish: "Ho gaya. Workspace update kar diya hai.",
    hindi: "हो गया। आपका बिज़नेस वर्कस्पेस अपडेट कर दिया है।",
    telugu: "పూర్తైంది. మీ బిజినెస్ వర్క్‌స్పేస్ అప్డేట్ అయింది.",
    gujarati: "થઈ ગયું. તમારું બિઝનેસ વર્કસ્પેસ અપડેટ થયું.",
    bangla: "হয়ে গেছে। আপনার বিজনেস ওয়ার্কস্পেস আপডেট হয়েছে।",
    tamil: "முடிந்தது. உங்கள் பிசினஸ் வேலைப்பகுதி புதுப்பிக்கப்பட்டது.",
    marathi: "झाले. तुमचे बिझनेस वर्कस्पेस अपडेट केले आहे.",
  };
  return `${map[language?.toLowerCase()] || map.english}\n\n"${message || ""}"`;
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    });
    return res.end();
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/health") return sendJson(res, 200, { ok: true });

  if (req.method === "POST" && url.pathname === "/auth/login") {
    const { email, password } = await readJson(req);
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "").trim();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail && u.password === normalizedPassword);
    if (!user) return sendJson(res, 401, { message: "Invalid credentials" });
    return sendJson(res, 200, { token: `token-${user.id}`, profile: { id: user.id, name: user.name, email: user.email }, mode: "owner" });
  }

  if (req.method === "POST" && url.pathname === "/auth/guest") {
    return sendJson(res, 200, { token: "guest-token", profile: { id: "guest", name: "Guest User" }, mode: "guest" });
  }

  if (req.method === "POST" && url.pathname === "/chat") {
    const { message = "", language = "english" } = await readJson(req);
    return sendJson(res, 200, { reply: chatReply(language, message), summary: buildSummary() });
  }

  if (req.method === "GET" && url.pathname === "/dashboard/summary") return sendJson(res, 200, buildSummary());

  if (req.method === "GET" && url.pathname === "/invoices") {
    const list = [...db.invoices].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return sendJson(res, 200, list);
  }

  if (req.method === "POST" && url.pathname === "/invoices") {
    const { customer, amount, gst } = await readJson(req);
    const base = Number(amount || 0);
    const gstAmount = gst ? Number((base * 0.18).toFixed(2)) : 0;
    const total = Number((base + gstAmount).toFixed(2));
    const invoice = { id: randomUUID(), customer: customer || "Unknown", amount: base, gst: !!gst, gstAmount, total, status: "sent", createdAt: nowIso() };
    db.invoices.unshift(invoice);
    return sendJson(res, 201, invoice);
  }

  if (req.method === "POST" && url.pathname === "/generate-invoice") {
    const { name, amount, gst } = await readJson(req);
    const base = Number(amount || 0);
    const gstAmount = gst ? Number((base * 0.18).toFixed(2)) : 0;
    const total = Number((base + gstAmount).toFixed(2));

    const invoice = {
      id: randomUUID(),
      customer: name || "Unknown",
      amount: base,
      gst: !!gst,
      gstAmount,
      total,
      status: "sent",
      createdAt: nowIso(),
    };

    db.invoices.unshift(invoice);

    const pdf = generateStyledPdf({
      invoiceId: invoice.id.slice(0, 8).toUpperCase(),
      customer: invoice.customer,
      rows: [
        { label: "Base Amount", value: `INR ${base.toFixed(2)}` },
        { label: "GST", value: gst ? `INR ${gstAmount.toFixed(2)}` : "Not Applied" },
      ],
      totals: { subtotal: base, gst: gst ? gstAmount : 0, total },
    });

    res.writeHead(200, { "Content-Type": "application/pdf", "Access-Control-Allow-Origin": "*" });
    return res.end(pdf);
  }

  if (req.method === "GET" && url.pathname === "/udhaar/list") {
    const entries = recalcUdhaar().sort((a, b) => +new Date(b.takenAt) - +new Date(a.takenAt));
    const summary = {
      totalGiven: entries.reduce((s, x) => s + x.amount, 0),
      totalPaid: entries.reduce((s, x) => s + x.paidAmount, 0),
      totalOutstanding: entries.reduce((s, x) => s + x.outstanding, 0),
    };
    return sendJson(res, 200, { entries, summary });
  }

  if (req.method === "POST" && url.pathname === "/udhaar") {
    const { name, amount, reason } = await readJson(req);
    const entry = {
      id: randomUUID(),
      name: name || "Unknown",
      amount: Number(amount || 0),
      reason: reason || "Business credit",
      takenAt: nowIso(),
      paidAmount: 0,
      paidAt: null,
      status: "pending",
    };
    db.udhaar.unshift(entry);
    return sendJson(res, 201, entry);
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/udhaar/") && url.pathname.endsWith("/pay")) {
    const id = url.pathname.split("/")[2];
    const body = await readJson(req);
    const pay = Number(body.amount || 0);
    const idx = db.udhaar.findIndex((x) => x.id === id);
    if (idx < 0) return sendJson(res, 404, { message: "Entry not found" });
    const item = db.udhaar[idx];
    item.paidAmount = Math.min(item.amount, Number((item.paidAmount + pay).toFixed(2)));
    item.paidAt = nowIso();
    item.status = item.paidAmount >= item.amount ? "closed" : "partial";
    return sendJson(res, 200, item);
  }

  if (req.method === "POST" && url.pathname === "/generate-udhaar") {
    const { name, amount, reason } = await readJson(req);
    const value = Number(amount || 0);

    const entry = {
      id: randomUUID(),
      name: name || "Unknown",
      amount: value,
      reason: reason || "Business credit",
      takenAt: nowIso(),
      paidAmount: 0,
      paidAt: null,
      status: "pending",
    };

    db.udhaar.unshift(entry);

    const pdf = generateStyledPdf({
      invoiceId: entry.id.slice(0, 8).toUpperCase(),
      customer: entry.name,
      rows: [
        { label: "Amount Given", value: `INR ${value.toFixed(2)}` },
        { label: "Reason", value: entry.reason },
      ],
      totals: { subtotal: value, total: value },
    });

    res.writeHead(200, { "Content-Type": "application/pdf", "Access-Control-Allow-Origin": "*" });
    return res.end(pdf);
  }

  if (req.method === "GET" && url.pathname === "/inventory") return sendJson(res, 200, db.inventory);

  if (req.method === "POST" && url.pathname === "/inventory") {
    const body = await readJson(req);
    const item = { id: randomUUID(), ...body, quantity: Number(body.quantity), threshold: Number(body.threshold), price: Number(body.price) };
    db.inventory.unshift(item);
    return sendJson(res, 201, item);
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/inventory/")) {
    const id = url.pathname.split("/")[2];
    const idx = db.inventory.findIndex((x) => x.id === id);
    if (idx < 0) return sendJson(res, 404, { message: "Item not found" });
    const body = await readJson(req);
    db.inventory[idx] = { ...db.inventory[idx], ...body, quantity: Number(body.quantity ?? db.inventory[idx].quantity) };
    return sendJson(res, 200, db.inventory[idx]);
  }

  return sendJson(res, 404, { message: "Not found" });
});

server.listen(PORT, () => console.log(`Biz-Agent backend running at http://127.0.0.1:${PORT}`));
