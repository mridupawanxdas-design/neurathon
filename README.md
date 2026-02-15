# Bharat Biz-Agent (Operational Prototype)

A local full-stack prototype for Indian business operations:
- fluid multilingual landing website (light/dark + language switch),
- login/guest entry,
- working dashboard chat,
- invoice + GST PDF generation,
- udhaar ledger + repayments + PDF generation,
- real-time-style inventory tracking.

## Do I need Python?
No. **Python is not required** to run this project locally.
You only need:
- Git
- Node.js (v20+ recommended, v22 ideal)
- npm (comes with Node)

## Install prerequisites (if your system is fresh)

### Windows (PowerShell)
```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
node -v
npm -v
git --version
```

### macOS (Terminal)
```bash
# install Homebrew if missing: https://brew.sh
brew install git node
node -v
npm -v
git --version
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
git --version
```

## One-command local run (recommended)

```bash
npm install
npm run dev:full
```

This starts:
- frontend at **http://localhost:5173**
- backend at **http://127.0.0.1:8000**

Then open:
- Home page: `http://localhost:5173/`
- Login page: `http://localhost:5173/login`


## Exact fix for `Missing script: "dev:full"`

If you still get this error, it usually means you are in the wrong folder or old commit.
Run exactly:

```bash
# 1) confirm folder has package.json
ls package.json

# 2) show scripts
npm run

# 3) update code
git fetch --all
git pull

# 4) install deps
npm install

# 5) optional health check
npm run doctor

# 6) run app
npm run dev:full
```

Fallback aliases:
```bash
npm run dev-full
npm run devfull
npm start
```

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

## Merge Lovable UI/UX into this repo (already connected backend)

You shared this Lovable repo:
- `https://github.com/mridupawanxdas-design/bharat-biz-agent-frontend.git`

To sync latest Lovable UI into this repo while preserving backend wiring:

```bash
git remote add lovable https://github.com/mridupawanxdas-design/bharat-biz-agent-frontend.git
# if remote already exists:
# git remote set-url lovable https://github.com/mridupawanxdas-design/bharat-biz-agent-frontend.git

git fetch lovable

# bring latest UI-focused files
git checkout lovable/main -- src/components src/contexts src/hooks src/assets src/pages/Index.tsx src/index.css src/App.css

# keep operational files from this repo (do NOT overwrite):
# server.js, src/api.ts, src/config.ts, vite.config.ts, src/pages/LoginPage.tsx,
# src/pages/Dashboard.tsx, src/pages/Invoice.tsx, src/pages/Udhaar.tsx, src/pages/Inventory.tsx
```

Then run:
```bash
npm run dev:full
```

## Notes
- Backend is currently in-memory for prototype speed; data resets on restart.
- This structure is deployable later by replacing in-memory DB and keeping API contracts.
