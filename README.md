# Swagat Enterprise Real Estate Platform

A React + Express real estate listing site and separate admin dashboard for **Swagat Enterprise**, solely owned by **Satish Pathak**. The backend is structured for PostgreSQL hosted on Supabase.

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

- Frontend: Next.js + React
- Backend: Node.js + Express
- Database: PostgreSQL hosted on Supabase
- Database access: `pg` connection pool
- Authentication: backend JWT for protected admin APIs
- Development fallback: in-memory demo data if PostgreSQL is not configured

## Run Locally

```bash
npm.cmd run install:all
npm.cmd run dev
```

Public site: http://localhost:3000  
Admin panel: http://localhost:3000/admin  
Backend API: http://localhost:5000/api

## Configure PostgreSQL

Copy `server/.env.example` to `server/.env` and add your Supabase PostgreSQL connection string and JWT secret.

```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://127.0.0.1:3000,http://localhost:3000
```

Run the SQL files in `server/migrations/` against the Supabase PostgreSQL database before using the production API.

Create the first admin by hashing a password:

```bash
npm.cmd --prefix server run hash:password -- "your-strong-password"
```

Then use the generated hash with the `create_admin_user(...)` PostgreSQL function from the migration.

The app still works with demo data when PostgreSQL is not configured.
