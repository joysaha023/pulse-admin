# Pulse Admin

A SaaS admin dashboard built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS**.

- Login with protected routes (Auth.js v5, JWT sessions, `middleware.ts`) and two roles: `admin` and `viewer`
- Dashboard: 4 KPI cards, revenue area chart, signups bar chart, plan donut, recent orders, 7d / 30d / 90d / 12m range
- Customers and Orders tables: server-side pagination and sorting, debounced search, status / plan / country / date filters, column visibility, CSV export of the filtered view
- Customer detail page with order history chart, edit and delete (admin only)
- Analytics and Settings pages, light / dark / system theme
- Responsive: mobile drawer, icon-only sidebar on tablet, full sidebar on desktop

## Run it

```bash
npm install
cp .env.example .env.local
# put a random secret after AUTH_SECRET=
openssl rand -base64 32
npm run dev          # http://localhost:3000
```

Demo accounts:

| Role   | Email               | Password    |
| ------ | ------------------- | ----------- |
| Admin  | admin@example.com   | Admin@123   |
| Viewer | viewer@example.com  | Viewer@123  |

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`.

## How it works

| Piece | Where |
| --- | --- |
| Route protection | `src/middleware.ts` + `authorized` callback in `src/lib/auth.config.ts` |
| Credentials login | `src/lib/auth.ts` (bcrypt) and `src/lib/users.ts` (demo users) |
| API guard (401 / 403) | `src/lib/api-guard.ts`, used by every route under `src/app/api` |
| Fake data (seeded, in memory) | `src/lib/mock-db.ts` |
| Filtering, sorting, paging | `src/lib/queries.ts` |
| KPI and chart numbers | `src/lib/metrics.ts` |
| URL-synced table state | `src/hooks/use-table-params.ts` |
| Generic table | `src/components/tables/data-table.tsx` |

API (all need a session): `GET /api/customers`, `GET /api/orders` (`page, pageSize, sort, order, search, status, plan, country, from, to, all=1`), `GET|PATCH|DELETE /api/customers/:id`, `GET /api/metrics?range=30d`. `PATCH` and `DELETE` are admin-only and return 403 for viewers.

## Notes

- Data lives in memory and resets when the server restarts. To go to production, replace `mock-db.ts` and `users.ts` with a real database (for example Prisma + Postgres) and keep the same function shapes.
- Deploy on Vercel: import the repo and set `AUTH_SECRET` (and `AUTH_TRUST_HOST=true` if you self-host). Note that in-memory data is not shared between serverless instances, so use a database for anything beyond a demo.
- Deviation from the original blueprint: the `Metrics` type returns `revenueSeries` / `signupsSeries` (bucketed by the selected range) instead of `revenueByMonth` / `signupsByDay`, plus `changes`, `mrrByPlan`, `topCountries` and `statusDistribution`.
