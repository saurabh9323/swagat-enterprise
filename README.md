# Swagat Enterprise Real Estate Platform

A MERN-style real estate listing site and separate admin dashboard for **Swagat Enterprise**, solely owned by **Satish Pathak**.

Base office:
Shop No 10, A Wing, Blossom Apartment, 90 Feet Road, Ostwal Nagari, Nalasopara East, Vasai-Virar, Palghar, Maharashtra 401209

## Business Model

- List flats, shops, resale references, and rental options around Nalasopara East.
- Capture buyer/renter leads from each property.
- Track lead intent, follow-up priority, expected commission, and deal stage.
- Give Satish Pathak a separate admin panel for inventory, hot leads, area interest, and projected brokerage.
- Convert inquiries through direct call, email, and WhatsApp actions.

## App Sections

- Public Swagat Enterprise site: `/`
- Separate admin panel: `/admin`
- Backend API: `/api`

## Frontend Routes

Public:
- `/`
- `/properties`
- `/properties/:id`
- `/about`
- `/contact`

Admin:
- `/admin/login`
- `/admin`
- `/admin/properties`
- `/admin/properties/new`
- `/admin/properties/:id/edit`
- `/admin/leads`
- `/admin/deals`
- `/admin/settings`

## Frontend Structure

```text
client/src/
  components/
    admin/
    common/
    layout/
    lead/
    property/
    public/
  constants/
  data/
  hooks/
  pages/
    admin/
    public/
  routes/
  utils/
```

The UI now uses small components, demo data is separated from UI, and shared formatting/filtering logic lives in `utils/`.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database-ready: MongoDB + Mongoose
- Development fallback: in-memory demo data if MongoDB is not configured

## Run Locally

```bash
npm.cmd run install:all
npm.cmd run dev
```

Public site: http://localhost:5173  
Admin panel: http://localhost:5173/admin  
Backend API: http://localhost:5000/api

## Configure MongoDB

Copy `server/.env.example` to `server/.env` and add your MongoDB URI.

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/swagat-enterprise
PORT=5000
```

The app works with demo data even before MongoDB is connected.
