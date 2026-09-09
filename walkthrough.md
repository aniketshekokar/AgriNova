# Walkthrough - AGRINOVA AgriTech Platform

We have successfully built the complete, responsive MVP for **AGRINOVA**, an Indian AgriTech startup connecting farmers, buyers, and transporters through an intelligent, transparent, and farmer-first supply chain.

---

## 🚀 Accomplishments & Features

1. **Farmer-First Design System**: Sleek custom styles featuring rich green (primary) and marigold yellow (accent) tones. Responsive, touch-friendly navigation, and large layout buttons optimized for rural Android users.
2. **True End-to-End Trade Simulation**:
   - **Farmer** lists a crop (e.g., Tomato) via a 6-step wizard.
   - **Buyer** browses the live marketplace, uses comparison filters, reviews direct billing splits, and confirms the trade.
   - **Transporter** accepts the booking request, records a farm-pickup Quality Inspection (generating a Digital Quality Report), and launches transit.
   - **Buyer** monitors delivery progress on a mock route tracking widget, clicks confirm arrival, and settles escrow funds directly to the farmer.
3. **Multilingual Architecture**: Translates headers, dashboard cards, labels, statuses, forms, and charts dynamically to English, Hindi, and Marathi with localized APMC terminology.
4. **Platform Analytics & Audits**: An Admin Dashboard aggregating system GMV, total registrations (by role), listed crop stocks, and verified quality certificates.
5. **FastAPI-Ready Python AI Service**: Built a zero-dependency Python-based server that provides API-ready endpoint structures returning mock predictive market bhav details.
6. **Express API Server**: Structured backend controller routing supporting `/api/auth`, `/api/crops`, `/api/orders`, and `/api/quality` endpoints.

---

## 📂 Project Architecture

- **Root files**:
  - `package.json`: Monorepo scripts utilizing `concurrently` to boot the apps.
- **`/frontend` (React + Vite + Tailwind)**:
  - `/src/locales/`: Centralized JSON translation keys for English, Hindi, and Marathi.
  - `/src/context/`: Zero-dependency Language and Session-Auth contexts.
  - `/src/pages/`: Highly interactive Landing, Login, SignUp, and Marketplace pages.
  - `/src/dashboard/`: Separate, custom interfaces for Farmers, Buyers, Transporters, and Admins.
- **`/backend` (Node + Express)**:
  - `server.js`: REST endpoints with CORS headers, logging, and model-level mappings.
- **`/ai` (Python Microservice)**:
  - `main.py`: Local HTTP server returning Random Forest prediction mock-ups.

---

## 🛠️ How to Run & Verify

> [!TIP]
> Ensure Python is installed on your machine. The frontend uses a portable Node.js v22 binary automatically configured inside `/node`.

### 1. Install Monorepo Packages
Open a terminal in the root `agridirect` directory and run:
```bash
./node/npm.cmd run install:all
```
*(This installs root, frontend, and backend packages in one go.)*

### 2. Launch the Application
Run the concurrent dev command to boot the React dashboard, Express backend, and Python prediction server together:
```bash
./node/npm.cmd run dev
```
- **React Frontend**: Open `http://localhost:3000`
- **Express Backend API**: Open `http://localhost:5000/health`
- **AI Service**: Open `http://localhost:8000`

### 3. Step-by-Step Validation Flow
1. **Multilingual Toggle**: Click the language switcher flags (English | हिंदी | मराठी) in the navigation bar. Check that titles and buttons translate instantly.
2. **Login as Farmer**: Go to `/login`. Click the **Demo Farmer** fast-fill button, then click Login.
   - Go to **Add Crop** tab. List a crop (e.g., 60 Quintals of Wheat at ₹2,200).
3. **Login as Buyer**: Logout and go to `/login`. Click **Demo Buyer**, then Login.
   - Go to **Marketplace**. Search for "Wheat", find your listing, click Buy Now, adjust quantity to 50, and confirm payment checkout.
4. **Login as Transporter**: Logout and go to `/login`. Click **Demo Driver**, then Login.
   - Go to **Delivery Jobs** and click **Accept Delivery** on your order.
   - Go to **Active Shipments**, click **Arrived at Farm**, then **Run Quality Verification**. Set quality to "Good", write comments, and click submit. The status transitions to **In Transit**.
5. **Finalize Escrow Payout**: Logout and re-login as **Buyer**.
   - Select your order, review the transporter's signed Quality Verification, and click **Confirm Delivery & Release Funds**. Payout completes!
6. **Platform Audits**: Login as **Demo Admin**. Check total transactions, listed crops, active transporters, and quality check reports.
