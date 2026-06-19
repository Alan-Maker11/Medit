# Medit Operations Management System

Web app for Medit, an assisted mobility transportation company in Santo Domingo,
Dominican Republic. Built with Next.js (App Router), Supabase, Tailwind CSS, and
the Google Maps JavaScript API. See [`PRD.md`](./PRD.md) for the full product
requirements document.

## Features

- **Public fare calculator** (`/`) — clients estimate trip cost in real time
  using Google Maps distance/duration, the 8 Medit service types, trip type
  (one-way/round-trip), private/public mode, and optional add-on fees.
- **Admin dashboard** (`/admin`, login required) — trip logging, expense
  tracking, vehicle and driver management, weekly/payroll reports with Excel
  export, and CSV import of historical data from Google Sheets.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Google Maps keys
```

Apply the database schema to your Supabase project:

```bash
# In the Supabase SQL editor, run the contents of:
supabase/schema.sql
```

Create an admin user in Supabase Auth (Authentication → Users → Add user) —
this is the only account that can sign in to `/admin`.

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public calculator,
or [http://localhost:3000/login](http://localhost:3000/login) for the admin
dashboard.

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS API key with Places + Distance Matrix enabled |

Without a Google Maps key, the public calculator falls back to manual
distance/duration entry.

## Project structure

```
app/                     Next.js App Router pages and API routes
  page.tsx                Public fare calculator
  login/                  Admin login
  admin/                  Admin dashboard (trips, expenses, vehicles, drivers, reports, import)
  api/                    REST API routes backing the admin dashboard and public calculator
components/              Shared React components
lib/                      Fare calculation, Supabase clients, shared types, CSV parsing
supabase/schema.sql       Database schema, seed data, and RLS policies
```

## Pricing formula

```
Total = 1250 (base) + distanceKm * 70 + durationMinutes * 30
      + (round-trip ? waitingHours * 350 : 0) + additionalFees
```

See `lib/fare.ts` for the implementation.

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase (Postgres + Auth)
· Google Maps JavaScript API · react-hook-form · xlsx · date-fns

## Deployment

Deploy to Vercel and set the environment variables above in the project
settings. The middleware (`middleware.ts`) protects all `/admin/*` routes,
redirecting unauthenticated users to `/login`.
