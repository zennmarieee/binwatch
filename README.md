# Binwatch

Binwatch is a lightweight Next.js app for monitoring and reporting on campus bins. It provides a public map, a reporting flow (QR codes and web reports), and an admin area with analytics and bin management.

## Features

- Admin dashboard for staff: manage bins and view analytics.
- Public map showing bin locations and statuses.
- Report a bin (QR code + web form) with photo and notes.
- QR code generation for individual bins.
- Supabase integration for authentication and data storage.

## Quick Start

Prerequisites: Node 18+ and npm.

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your Supabase credentials (example):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm start
```

## Project Layout

- `app/` — Next.js app routes and pages (public site + admin).
- `components/` — React UI components used across the app.
- `lib/` — shared utilities (Supabase helpers, QR helpers, etc.).
- `data/` — seed or static data used during development.
- `api/` — server routes for analytics, bin QR generation, and admin actions.

## Scripts

- `npm run dev` — development server
- `npm run build` — create production build
- `npm start` — run production server
- `npm run lint` — run ESLint

## Contributing

Contributions welcome — open an issue or submit a PR. Keep changes focused and add notes in your PR describing the intent.

## Notes

- This project uses Supabase for backend services and Leaflet for mapping.
- See `package.json` for a list of dependencies and dev tools.

If you'd like, I can also add environment examples, badges, or CI instructions.
