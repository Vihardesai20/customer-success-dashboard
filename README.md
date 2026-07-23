# Customer Success Dashboard

Modern SaaS dashboard for Customer Success teams — portfolio ARR, risk, renewals, and account health.

## Phase 1

- App shell with left sidebar + top header
- Four KPI cards derived from mock customer data
- Responsive layout (desktop + mobile)
- Clean reusable components

## Phase 2

- Full customer portfolio table
- Search by customer name
- Filters: health status, industry, renewal window (30/60/90 days)
- Sort by ARR, health score, and renewal date
- Clear filters, result count, and empty state

## Phase 3

- Portfolio analytics charts (Recharts)
- Customer health distribution
- ARR by health status
- Upcoming renewals by month (next 6 months)
- ARR by industry (highest to lowest)

## Phase 4

- Clickable customer names in the portfolio table
- Dynamic customer detail route at `/customers/[id]`
- Customer overview + account insights
- Helpful not-found state for invalid IDs

## Phase 5

- CSV import with drag-and-drop upload
- Validation, preview, and browser-session portfolio replacement
- Reset to mock data
- Downloadable sample CSV template
- Shared `CustomerProvider` for KPIs, charts, table, and detail pages

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Papa Parse

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sample CSV template: [http://localhost:3000/sample-customers.csv](http://localhost:3000/sample-customers.csv).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
