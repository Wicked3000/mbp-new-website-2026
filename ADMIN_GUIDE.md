# MBP Admin Dashboard — Guide

## What’s Dynamic (admin-manageable)

| Section             | Admin page        | DB table                               | Home/Page location                                       |
| ------------------- | ----------------- | -------------------------------------- | -------------------------------------------------------- |
| Hero Slider         | /admin/hero       | hero_slides                            | Home HeroSection                                         |
| Quick Links         | /admin/quicklinks | quick_links                            | QuickLinksStrip                                          |
| News                | /admin/news       | news                                   | NewsSection left column                                  |
| Notices             | /admin/notices    | notices                                | Notice Board right column                                |
| Events              | /admin/events     | events                                 | Upcoming Events                                          |
| Programs            | /admin/programs   | programs                               | Education Programs (4 cards)                             |
| Stats               | /admin/stats      | stats                                  | Stats strip (312, 48k…)                                  |
| Districts & Schools | /admin/districts  | districts (+ schools)                  | Every District section + BasicEducation school directory |
| Leadership          | /admin/leadership | leadership                             | About page + Advisor message                             |
| Selections G9/G11   | /admin/selections | selections_grade9 / selections_grade11 | /selections                                              |
| Messages            | /admin/messages   | contact_messages                       | /contact form submissions                                |
| Partners            | /admin/partners   | partners                               | Trusted partners strip                                   |
| Downloads           | /admin/downloads  | downloads                              | Documents & Downloads                                    |
| Site Settings       | /admin/settings   | site_settings                          | Header phone/email, footer address, helpdesk             |

All sections fall back to bundled seed data if the database is unreachable (a localStorage mock in `src/lib/api.ts`), so the site still renders without a running server. Real errors are never swallowed - see "Dev Fallback" below.

## Local Setup

The API is part of the Next.js app, so there is nothing separate to deploy or start.

1. **Start MySQL** (XAMPP, or any server on `DB_HOST`/`DB_PORT`).
2. **Import the database** (once): `backend/database/mbp_education.sql` creates `mbp_education` with its tables and seed data. Import it with phpMyAdmin or `mysql`.
3. **Configure the connection** in `.env`: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. Defaults suit a local XAMPP install.
4. **Apply the schema**: `npm run db:ensure`. This adds any missing tables and columns (see AGENTS.md, "Schema"). Run it once after the import, and again after a deploy that changes the schema.
5. **Run the site and API together**: `npm run dev` → http://localhost:3000

### Optional: the legacy PHP API

`backend/api` is still a complete implementation and remains the fallback when
the site is served by Apache instead of Next. To use it, copy `backend/api` →
`C:\xampp\htdocs\mbp-api` and point the client at it with
`NEXT_PUBLIC_API_BASE=http://localhost/mbp-api` in `.env`. That is the only
reason the PHP copy still exists; the two entity maps are checked against each
other by `npm run verify:sync`.
7. **Set the admin password**: the seed deliberately creates the `admin` account
   with no password, so nothing works until you do this:

   ```bash
   npm run admin:password -- admin 'a long unique passphrase'
   ```

   The command also signs out any existing session. Afterwards, change it any
   time from **Admin → Settings → Change Password**.

## API

Route Handlers under `app/api/`. All paths are relative to the site origin -
there is no separate API host and therefore no CORS.

- `POST /api/auth/login` → sets the session cookie; body {username, password}
- `POST /api/auth/logout` → clears the cookie
- `GET /api/auth/me` (auth) → the current user
- `POST /api/auth/change-password` (auth) → rotates the password and retires every
  other session
- `GET /api/entities?entity=news` (public for hero/news/notices/events/programs/stats/districts/schools/leadership/partners/quick_links/downloads/site_settings/selections; auth for users, contact_messages, whatsapp_subscribers and selection_students)
- `POST /api/entities?entity=...` / `PUT /api/entities?entity=...&id=1` / `DELETE /api/entities?entity=...&id=1` (auth required)
- `POST /api/contact` (public)
- `GET /api/stats/dashboard` (auth)
- `POST /api/whatsapp/subscribe` (public)
- `POST /api/selections/students/bulk` (auth)
- `POST /api/upload` (auth) → {url, filename}
- `GET /api/health`

## Dev Fallback

If API unreachable, `src/lib/api.ts` uses `localStorage` (`mbp_mock_db_v1`) with the same seed data. Admin CRUD still works locally. Real errors (a 401, a 500, a rejected file) are reported instead of being written to the local store.

## Security Notes

- Auth is a stateless HS256 JWT, valid for one day, held in an httpOnly,
  SameSite=Lax cookie. Page script cannot read it, so an XSS in the admin cannot
  lift the session the way the old localStorage token could. Each token carries
  the user's `auth_version`; changing a password increments it, so tokens issued
  from the old password stop working immediately.
- Admin pages are gated on the server in `app/admin/(dash)/layout.tsx`, which
  re-checks `auth_version` against the database on every request. The check is
  not in `middleware.ts`: that runs on the Edge runtime, where `jsonwebtoken`
  does not work and there is no database access.
- `JWT_SECRET` must be set in `.env` (32+ characters) - the API refuses to start
  under `NODE_ENV=production` without it. Never commit a real `.env`.
- Behind Apache, nginx or a load balancer, set `TRUSTED_PROXY=1` so rate
  limiting keys on the real client address instead of the proxy's. Without it
  every request shares one bucket and one admin hammering the login page locks
  out the whole site.
- Rate-limit buckets are per process, in memory. That is exact for a single
  instance; behind a load balancer with N instances the effective limit is N x
  the configured one.
- The public site content is world-readable by design; anything holding personal
  data (`contact_messages`, `whatsapp_subscribers`, `selection_students`,
  `users`) requires a token, and `selection_students` holds minors' details.
- Serve everything over HTTPS in production and add rate limiting at the reverse
  proxy as well.
- Deploy to a host with a writable, persistent filesystem. Admin uploads are
  written to `public/uploads/`; on a serverless runtime the write is discarded
  when the invocation ends and the image 404s while the API reported success.
- `npm test` covers the client, the admin route table and the fragment-scroll
  behaviour. The Route Handlers are covered by `npm run build` and by exercising
  the admin; the Express-era supertest suite went away with Express.
