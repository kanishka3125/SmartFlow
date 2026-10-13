# SmartFlow — AI-Powered Hospital Operations Intelligence

**Every Bed. Every Decision. Smarter.**

SYNESIS is an AI-powered hospital operations and resource optimization platform designed to help hospital teams anticipate patient demand, monitor bed availability, identify capacity risks, and make better-informed operational decisions.

By combining predictive analytics, hospital capacity monitoring, explainable alerts, and interactive surge simulation, SYNESIS aims to support more efficient hospital resource planning.

---

## Overview

Hospital operations teams must manage changing patient volumes, limited bed capacity, and competing resource requirements. Without a unified operational view, identifying potential bottlenecks early can be challenging.

SYNESIS provides a centralized interface for understanding hospital capacity, exploring future demand, and evaluating possible operational responses.

## Key Features

- **Hospital Operations Dashboard** — Centralized visibility into hospital capacity and operational metrics.
- **Patient Demand Forecasting** — Predictive analysis of expected patient arrivals.
- **Bed Capacity Monitoring** — Track occupied beds, available beds, and ward-level occupancy.
- **Intelligent Bed Allocation** — Support resource allocation based on availability and operational constraints.
- **Explainable Alerts** — Identify potential overcrowding and capacity risks using configurable rules.
- **Surge Simulation** — Explore how increased patient arrivals may affect future hospital capacity.
- **AI-Powered Operational Assistant** — Gemini-powered explanations and summaries based on supplied operational context.
- **Interactive User Interface** — Responsive dashboards, data visualizations, and smooth user interactions.

*Feature availability depends on the current implementation. Forecasts and simulations should be validated before any real-world operational use.*

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Animations | Motion |
| Data Visualization | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express |
| AI Integration | Google GenAI SDK |
| Configuration | dotenv |

## System Architecture

```text
                   SYNESIS
                      |
          React + TypeScript Frontend
                      |
            Express Application Server
                      |
          +-----------+-----------+
          |           |           |
      Health API   Gemini APIs   Hospital
                                Analytics
                                    |
                       +------------+------------+
                       |            |            |
                   Forecasting   Capacity      Rules &
                                 Projection   Recommendations
```

The hospital analytics components represent the intended architecture and should be connected to the existing application as they are implemented. The current Express server provides health-check and Gemini operational-assistance endpoints.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- Git installed.
- A Google Gemini API key if you want to use the AI-powered endpoints.

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with your actual repository URL and project directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your API key. Never commit your `.env` file or expose API keys in frontend code.

The Gemini integration is optional for starting the application, although AI-generated responses require valid configuration and API access.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Verify server health

Open:

```text
http://localhost:3000/api/health
```

The endpoint returns the server status, Gemini configuration status, and a timestamp.

### 6. Build the frontend

```bash
npm run build
```

This generates the production frontend build in the `dist/` directory.

For production, configure the appropriate environment and start the Express server using:

```bash
npm start
```

## Existing API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server status and Gemini configuration |
| POST | `/api/gemini/ask` | Ask an operational question using supplied context |
| POST | `/api/gemini/summary` | Generate an operational summary from supplied data |

The request and response structures are defined by the existing backend implementation.

## Example Use Cases

1. Monitor bed occupancy across hospital departments.
2. Identify wards approaching configured capacity thresholds.
3. Examine forecasts of future patient arrivals.
4. Simulate patient surges and evaluate potential capacity pressure.
5. Generate operational summaries to help administrators review hospital conditions.
6. Explore resource allocation options for human review.

## Project Goals

- Improve visibility into hospital resource utilization.
- Support earlier identification of potential capacity bottlenecks.
- Make operational insights easier to understand.
- Explore predictive analytics for hospital demand planning.
- Provide an extensible foundation for healthcare operations intelligence.

## Data and Responsible Use

SYNESIS is a hackathon prototype, not a validated clinical decision-support system.

- Synthetic data may be used for demonstrations and testing.
- Forecasts are estimates and may be inaccurate.
- Simulated outcomes do not establish real-world performance improvements.
- Recommendations are intended to support human review, not replace clinical judgment.
- Real-world deployment would require appropriate data governance, security, validation, and hospital-specific integration.

## Future Enhancements

- Improved forecasting models and evaluation.
- More advanced ward-level capacity optimization.
- Historical trend analysis.
- Enhanced surge-response planning.
- Integration with authorized hospital information systems.
- Expanded operational analytics and reporting.

## Team

**Project:** SYNESIS — AI-Powered Hospital Operations Intelligence

**Built for:** Hackathon prototype

Developed collaboratively by a four-member team.

## License

No license has been specified yet. Add an appropriate `LICENSE` file before distributing the project as open source.

---

**SYNESIS — Turning hospital operations data into actionable intelligence.**
