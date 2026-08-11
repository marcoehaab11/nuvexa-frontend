# NUVEXA Frontend

Native Next.js 16 frontend for NUVEXA Properties, designed for Vercel and backed by the separate NUVEXA ASP.NET Core API.

## Local development

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` and point both API variables at the backend. The public catalog, projects, details, map, and admin dashboard use database-backed API responses.

## Vercel

Import this repository with the default Next.js settings and configure:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `API_INTERNAL_URL`

The admin is available at `/admin`. Authentication is proxied through `/api/admin/auth/*` so the secure session cookie remains first-party.

## Checks

```bash
npm run lint
npm run build
```
