# MBP Education Website

Next.js (App Router) + Tailwind CSS website for the Milne Bay Province Division of Education. The site and its API are one application: Route Handlers under `app/api/` replace the former Express server, so there is no second process and no CORS.

## Development Server

`npm run dev` starts Next.js, which serves the site and `/api/*` together on `$PORT` (default `3000`). Hot reload applies to both.

Before the first run against a fresh database:

```
npm run db:ensure
```

This applies the idempotent schema the Express server used to apply at boot. App Router has no boot hook, so it is an explicit step — see "Schema" below.

- Site and API: `npm run dev`
- Production build: `npm run build` then `npm run start`
- Tests: `npm test`
- Typecheck: `npm run typecheck`

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `app/layout.tsx` - Root layout: `<html>`/`<body>`, global CSS import, and the site `metadata` that used to live in `index.html`
- `app/(site)/` - Public pages. A route group, so `(site)` never appears in a URL. One `page.tsx` per route; each renders a component from `src/views/`
- `app/(site)/template.tsx` - Entry animation and fragment-scroll handling. Remounted by Next on every navigation, which is what replays the animation
- `app/(site)/layout.tsx` - Skip link only. Site header and footer stay in the page components
- `app/admin/(dash)/` - Authenticated admin pages. The layout here verifies the session cookie on the server and redirects to the login page if it is missing or revoked
- `app/admin/login/page.tsx` - The only admin route outside the guard, and the only one reachable signed out
- `app/api/**/route.ts` - Route Handlers replacing the Express controllers
- `app/globals.css` - Global CSS entrypoint, Tailwind v4 import, `@theme` block, and the motion keyframes
- `lib/db.ts` - `mysql2` pool singleton, cached on `globalThis` so hot reloads do not leak connections
- `lib/auth.ts` - JWT signing and verification, the session cookie, and the `auth_version` revocation check
- `lib/entities.ts` - The entity allowlist and column map. Interpolated into SQL, so it is a security boundary; three scripts import it directly
- `lib/ensure-schema.ts` - Idempotent schema self-healing, run by `npm run db:ensure`
- `lib/http.ts`, `lib/rate-limit.ts` - Response helpers and the fixed-window limiter
- `src/views/` - Public page components (renamed from `src/pages`; see "Renames" below)
- `src/components/`, `src/home/`, `src/admin/` - Shared components
- `src/lib/api.ts` - Browser API client. Seeds an offline localStorage fallback on first use
- `next.config.ts` - Security headers, including the sandbox CSP for `/uploads`
- `postcss.config.mjs` - Tailwind v4 via `@tailwindcss/postcss`
- `tsconfig.json` - Path aliases: `@/*` → `src/*`, `@server/*` → `lib/*`, `@app/*` → `app/*`
- `public/assets/` - Site imagery, referenced by root-absolute path (`/assets/...`) and served statically
- `public/uploads/` - Admin-uploaded files

## Renames

Two directories were renamed during the Vite/Express → Next.js migration, and both names are load-bearing:

- `src/pages` → `src/views`. Next.js treats **any** directory named `pages` as a Pages Router root and refuses to build alongside `app/` ("`pages` and `app` directories should be under the same folder"). The routes now live in `app/(site)/`; `src/views` holds the components behind them.
- `src/index.css` → `app/globals.css`. Next requires global CSS to be imported from the root layout.

## Dependencies

- Runtime: Next.js 16, React 19, React DOM 19
- Server: `mysql2`, `jsonwebtoken`, `bcryptjs`
- Styling: Tailwind CSS v4 with the `@tailwindcss/postcss` plugin
- Build tooling: TypeScript 5.9 (strict), Vite 8 via Vitest for tests only
- Formatting: oxfmt
- Scripts: `dotenv`, used only by the standalone scripts under `scripts/`

## Styling

Tailwind CSS v4 runs through `@tailwindcss/postcss` in `postcss.config.mjs`. `app/globals.css` imports Tailwind with `@import 'tailwindcss';` and carries the `@theme` block that defines the colour and font tokens. There is deliberately no `tailwind.config.js`: v4 reads its theme from that CSS block, and a config file would be a second, competing source of truth.

`app/layout.tsx` imports `app/globals.css`, so global font wiring belongs there. Keep CSS `@import` statements first, then any `@font-face` rules and font-family defaults.

## Schema

`npm run db:ensure` applies the column and table self-healing that the Express server ran automatically at boot. It is a separate step because App Router has no module that runs exactly once before the server accepts traffic.

This is a real behavioural difference from the old setup: the Express server repaired itself on every start, and this one has to be told. A deploy that skips the step will serve 500s from the admin until someone notices, so run it as a release step.

## Uploads and deployment

Admin uploads are written to `public/uploads/` and served from the same origin. `next start` serves `public/` from disk at request time, so a file is reachable as soon as it is written, with no rebuild.

**This requires a persistent, writable filesystem.** It rules out Vercel and every other serverless runtime, where the write is discarded when the invocation ends: the API would return 200, the admin would show the image, and the browser would 404. `vercel.json` in this repo predates the migration and still describes a static Vite build — it will produce a broken deploy if used.

`public/uploads/` is committed to git (via git-lfs) so an upload survives a redeploy from a clean checkout.

## Authentication

The admin session is an httpOnly, SameSite=Lax cookie set by `app/api/auth/login/route.ts`. It is not readable by page script, which is the point of the move off `localStorage`.

Admin gating happens on the server in `app/admin/(dash)/layout.tsx`, not in `middleware.ts`: the guard re-reads `users.auth_version` from MySQL on every request so that a password change retires live sessions, and that check needs database access, which `middleware.ts` does not have. It also runs on the Edge runtime, where `jsonwebtoken` does not work.

`src/lib/api.ts` therefore has no `isAuthed()` or `user()`. The signed-in username reaches the admin shell as a prop from the verified claims.
