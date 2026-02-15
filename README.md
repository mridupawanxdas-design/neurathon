# Bharat Biz-Agent (Operational Prototype)

A local full-stack prototype for Indian business operations:
- fluid multilingual landing website (light/dark + language switch),
- login/guest entry,
- working dashboard chat,
- invoice + GST PDF generation,
- udhaar ledger + repayments + PDF generation,
- real-time-style inventory tracking.

## One-command local run (recommended)

```bash
npm run dev:full
```

This starts:
- frontend at **http://localhost:5173**
- backend at **http://127.0.0.1:8000**

Then open:
- Home page: `http://localhost:5173/`
- Login page: `http://localhost:5173/login`

## Separate run (manual)

### Terminal 1
```bash
npm run server
```

### Terminal 2
```bash
npm run dev
```

## How frontend and backend are connected

- Frontend uses `API_BASE=/api` by default.
- Vite proxies `/api/*` to backend (`http://127.0.0.1:8000`) in local dev.
- So API calls work from browser without CORS/manual URL editing.

## Docker run

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

The frontend container is also configured to proxy `/api` to `backend:8000`.

## Demo flow
1. Open `/` and click **Try the Agent**.
2. Use prefilled credentials (`owner@bizagent.in / demo123`) or continue as guest.
3. Dashboard: use chat and navigate sections.
4. Invoice Center: add entries and download invoice PDF.
5. Udhaar Ledger: add entries, record repayments, and download ledger PDF.
6. Inventory: add stock and adjust quantity.

## Notes
- Backend is currently in-memory for prototype speed; data resets on restart.
- This structure is deployable later by replacing in-memory DB and keeping API contracts.

## If you want to bring your Lovable frontend repo

You can import your design repo and keep this backend/API wiring:

```bash
git remote add lovable-frontend https://github.com/mridupawanxdas-design/bharat-biz-agent-frontend.git
git fetch lovable-frontend
git checkout -b merge-lovable-ui
```

Keep these files from this repo for operations:
- `server.js`
- `src/api.ts`
- `src/config.ts`
- `vite.config.ts`
- operational pages in `src/pages/*` that call backend APIs.
