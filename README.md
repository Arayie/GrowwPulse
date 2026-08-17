# Groww Pulse - Automated AI Review Insights Engine

Groww Pulse is an executive intelligence platform designed to ingest raw, public Play Store and App Store reviews, scrub 100% of Personally Identifiable Information (PII), cluster feedback into urgent themes using machine learning, and synthesize role-contextualized executive pulse notes, visual PDF reports, and automated HTML email digests.

---

## Architecture Overview

Groww Pulse is built using a decoupled architecture:

- **Backend (`/backend`)**: Built with **FastAPI**, **Python 3.9+**, **Scikit-Learn** (TF-IDF Vectorization & KMeans Clustering), **Google Antigravity SDK** (Gemini 2.5 LLM Synthesis), **Matplotlib** (Visual Chart Rendering), **WeasyPrint / FPDF2** (PDF Generation), and **SMTP** (Live Email Dispatcher).
- **Frontend (`/frontend`)**: Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Recharts** (Interactive Happiness, Urgency Heatmap & Diagnostics Charts), and **Lucide React** icons.

---

## Key Features

1. **Phase 3: Advanced Data Sanitization**: `AdvancedPIIScrubber` regex engine redacts Emails (`[EMAIL REDACTED]`), 10-digit Phone Numbers (`[PHONE REDACTED]`), Handles (`[USERNAME REDACTED]`), and Account/Device IDs (`[ID REDACTED]`).
2. **Phase 4 & 5: TF-IDF & KMeans Clustering**: Clusters review embeddings into 5 distinct themes and generates role-contextualized reports strictly under 250 words.
3. **Phase 6 & 7: 3-Page Executive Dashboard**: Includes an animated horizontal market ticker (`MarketBar`), `RoleSelector` pill toggle, interactive charts, raw dataset filtering (`/library`), and automated email subscription intake (`/intake`).
4. **Phase 8 & 9: PDF Export & Live SMTP Dispatcher**: In-memory Matplotlib graph generation (`figsize=(7, 3.5)`, `300 DPI`), embedded base64 Groww branding, and automated HTML email sending.
5. **Non-Blocking Execution**: synchronous PDF rendering and SMTP dispatches are offloaded to worker threads via `asyncio.to_thread`.

---

## How to Run Locally

### Prerequisites
- Python 3.9 or higher
- Node.js 18+ and `npm`

### Step 1: Start the FastAPI Backend
```bash
# Navigate to the backend directory
cd backend

# Activate the virtual environment
source venv/bin/activate

# Start the uvicorn development server
uvicorn main:app --reload --port 8000
```
- OpenAPI Documentation available at: `http://127.0.0.1:8000/docs`
- Root Health Endpoint: `http://127.0.0.1:8000/`

### Step 2: Start the Next.js Frontend
Open a second terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies (if first time)
npm install

# Start the Next.js development server
npm run dev
```
- Open your browser to `http://localhost:3000` to interact with the executive dashboard.

---

## Data Refresh & Library Workflow

To update the dataset with new monthly or weekly reviews:

1. Place your new CSV file inside `backend/library/` (or overwrite `backend/reviews.csv`).
2. Ensure the CSV contains a column named `Review Text` or `review_text`.
3. The backend automatically detects the text column, applies `AdvancedPIIScrubber`, and re-clusters the embeddings into 5 themes on demand.
4. Users can preview, search, filter, and download the sanitized dataset directly from the Data Library page (`/library`).

---

## Role-Based Insights

Groww Pulse tailors its machine learning summaries and action cards based on stakeholder perspective:

- **Product & Growth**: Focuses heavily on emerging bugs, AutoPay mandate deduplication, feature requests, and onboarding bottlenecks.
- **Customer Support**: Focuses heavily on dominant user sentiment, ticket escalation SLAs (>48h), and instant credit playbooks.
- **Leadership Lens**: Focuses heavily on high-level brand health, regulatory compliance, and banking partner gateway SLAs.

---

## Deployment Guide

### Deploying Backend to Render
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a new **Web Service** selecting the `backend/` directory.
3. Set the **Build Command**: `pip install -r requirements.txt`
4. Set the **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `SMTP_EMAIL`: Your SMTP sender email address
   - `SMTP_PASSWORD`: Your SMTP app password
   - `GEMINI_API_KEY`: Your Gemini API key

### Deploying Frontend to Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com/).
2. Select `frontend` as the root directory.
3. Framework Preset: **Next.js**
4. Set **Build Command**: `npx next build`
5. Deploy and access your live URL!

---

## License & Branding

© 2026 Groww Pulse Insights Engine. All rights reserved.
