# Sheet‑R — Personal Film Tracker

A Next.js app to track films, manage a watch queue, and write reviews, using Google Sheets as a lightweight data source.

## Definition

Sheet‑R helps you:

- Log watched films and write reviews
- Manage a watch/download queue
- View stats and charts in an admin dashboard

Data source: Google Sheets. Admin UI: queue, reviews, events, charts.

### Key Screens

- Home: `features/home/page.tsx`
- Dashboard: `features/admin/pages/dashboard.tsx`
- Reviews: `features/admin/pages/reviews.tsx`
- Downlist: `features/admin/pages/downlist.tsx`
- Special Week: `features/admin/pages/speweek.tsx`

## How It Works

- Components live under `components/` (e.g. `components/ui/sidebar.tsx`, `components/ui/chart.tsx`)
- Admin features under `features/admin/` (e.g. `features/admin/components/chart-area-interactive.tsx`)
- Pages use hooks/server actions to fetch/mutate sheet data, then render tables, forms, and charts

## How to Install

1. Prerequisites: Node 18+, pnpm
2. Environment:
   - `cp .env.example .env`
   - Fill Google Sheets/API credentials
3. Install: `pnpm install`
4. Run (dev): `pnpm dev` → http://localhost:3000
5. Build: `pnpm build`
6. Start (prod): `pnpm start`
7. Deploy: Vercel recommended

### Quick Commands (Linux)

| Action | pnpm         | npm             | yarn         | bun             |
| ------ | ------------ | --------------- | ------------ | --------------- |
| Dev    | `pnpm dev`   | `npm run dev`   | `yarn dev`   | `bun dev`       |
| Build  | `pnpm build` | `npm run build` | `yarn build` | `bun run build` |
| Start  | `pnpm start` | `npm start`     | `yarn start` | `bun start`     |

## Libraries / Tools Used

- Framework: Next.js (App Router), React, TypeScript
- Styling: Tailwind CSS, PostCSS
- Icons: lucide‑react
- Tables: TanStack Table
- Forms/Validation: React Hook Form, Zod
- Charts: Recharts
- UI Primitives: shadcn‑style components under `components/ui/`
- Package manager: pnpm

## Tech Stack

- Frontend: React 18 + Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Visualization: Recharts
- Forms: React Hook Form, Zod
- Tooling: PostCSS, pnpm

## Getting Started

Run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open http://localhost:3000 and edit `app/page.tsx`. Hot reload is enabled.

This project uses `next/font` to optimize and load Geist.

## Learn More

- Next.js docs: https://nextjs.org/docs
- Interactive tutorial: https://nextjs.org/learn
- Next.js GitHub: https://github.com/vercel/next.js

## Deploy on Vercel

Use the Vercel Platform: https://vercel.com/new
Docs: https://nextjs.org/docs/app/building-your-application/deploying
