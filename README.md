# SmartFlow — Hospital Operations Platform

[![CI](https://github.com/Seshu021/synesis-hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/Seshu021/synesis-hackathon/actions/workflows/ci.yml)

SmartFlow is an intelligent hospital operations and resource-optimization dashboard built for the SYNESIS 26 hackathon. It gives operations staff one place to watch bed occupancy, ED boarding, arrival forecasts, bottlenecks, discharges, billing, insurance and diagnostics — and to act on them through an approval-gated "Flow Autopilot" and a what-if simulator.

All hospital data is synthetic and lives in `src/data/initialData.ts`.

## Stack

- React 19 + Vite + Tailwind CSS v4
- Recharts for charts, lucide-react for icons
- Express server (`server.ts`) that serves the app and proxies the optional Gemini assistant
- Bun for package management

## Run locally

Prerequisites: [Bun](https://bun.sh) 1.4+ (or Node.js 20+ with npm).

```bash
bun install
cp .env.example .env   # optional — see below
bun run dev            # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `bun run lint` | Type-checks the project with `tsc --noEmit` |
| `bun run build` | Production build into `dist/` |
| `bun run start` | Starts the Express server (serves `dist/` when `NODE_ENV=production`) |

## Environment variables

Defined in `.env.example`:

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Port for the Express server. Defaults to `3000`. |
| `GEMINI_API_KEY` | No | Enables the Gemini-backed "Ask SmartFlow" assistant. Without it the app falls back to a deterministic, data-grounded rule engine. |

`.env` is git-ignored — never commit real keys. The build does not need any secrets.

## Project layout

```
src/
  components/
    ui/            Shared design-system components (Card, StatNumber, PillButton, HeroCard, …)
    TopBar.tsx     Pill-tab navigation
  context/         HospitalContext: state, actions and computed KPIs
  views/           One file per module (Command Center, Beds, Forecast, …)
  services/        Forecasting, bed allocation, simulator and Gemini client
server.ts          Express server + Gemini proxy
```
