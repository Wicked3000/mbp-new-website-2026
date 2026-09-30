# Milne Bay Province Division of Education Website

Next.js (App Router) + Tailwind CSS website for the Milne Bay Province Division of Education. The site and its MySQL-backed API are one application: Route Handlers under `app/api/` serve `/api/*` from the same process, so there is no second server, no CORS, and no dev proxy. The legacy PHP API under `backend/` is still supported for offline fallback.

## Recent Updates

- Added WhatsApp subscription management:
  - Public subscription form on the home page.
  - Admin management at `/admin/whatsapp-subscribers`.
  - Search, add, edit, and delete subscriber records.
  - Database table: `whatsapp_subscribers`.
- Added database-backed Grade 9 and Grade 11 student placement lists:
  - CSV bulk import and individual entry in Admin → Selections.
  - Grade 9 CSV headings: `NO., PRIMARY SCHOOL, SURNAME, FIRST NAME, GENDER`.
  - Grade 11 CSV headings: `NAME, Gender, SLF No, Transferred From`.
  - Select a school for the CSV before importing.
  - School lists display alphabetically.
  - Grade 11 uses capacity, placed, and cutoff totals; streams are not assigned at selection stage.
- Added document file uploads in Admin → Downloads:
  - PDF, DOC/DOCX, XLS/XLSX, CSV, and TXT files up to 25MB.
  - Public Document Library uses document icons instead of exposing raw file paths.
- Updated the Contact page:
  - New `assets/contact/contact-banner-img.jpg` banner.
  - Inline SVG icons replace contact emojis.
  - Full-width Visit Us map section below the contact content.
  - Subtle coastal banner treatment with an animated wave.
- Updated education program imagery:
  - FODE section and banner images from `assets/fode`.
  - VET section and banner images from `assets/vet`.
  - VET banner overlay uses a navy-to-teal treatment.

## Requirements

- Node.js 20+
- npm or pnpm
- MySQL
- XAMPP is supported for the legacy PHP API

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and update database/API values if needed.

3. Start MySQL and import `backend/database/mbp_education.sql` into the `mbp_education` database.

4. Apply the schema. This is a separate step because App Router has no boot
   hook, so nothing repairs the database for you at startup:

   ```bash
   npm run db:ensure
   ```

5. Start the site and API together - it is one process:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`.

## Admin Dashboard

Open `http://localhost:3000/admin/login`.

The seed data creates an `admin` account **without a password**, so nothing can
be signed into until you set one. Any password committed to the repository is a
published credential, which is why the seed ships empty:

```bash
npm run admin:password -- admin 'a long unique passphrase'
```

Sign in, then rotate it any time from Admin → Settings → Change Password, which
also signs out every other device. Set `JWT_SECRET` in `.env` to a random value
of at least 32 characters:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never deploy with the seeded account or the published development `JWT_SECRET`.

## Useful Commands

```bash
npm run build
npm run start
npm run db:ensure
npm run typecheck
npm test
npm run format
npm run admin:password -- admin 'a long unique passphrase'
```

## The Two API Clients

The browser is served by the Next.js Route Handlers in `app/api/`, or by the
legacy PHP API (`backend/api/`) when that is deployed instead. Both keep their
own copy of the entity map, and `lib/entities.ts` is the single source of truth. After adding an entity to
`ENTITY_MAP` in `lib/entities.ts`, regenerate the PHP copy and confirm they agree:

```bash
npm run sync:php
npm run verify:sync
```

Skipping this is what broke the Home Page admin: the PHP map was still the
original 19 entities, so every page-section request answered
`400 Unknown entity` even though the tables were right there in the database.

## Project Structure

- `app/` - the route tree. `app/(site)/` holds the public pages, `app/admin/(dash)/` the authenticated admin pages behind a server-side guard, and `app/api/` the Route Handlers.
- `src/home` - home page sections, one component per file.
- `src/views` - the components behind the public pages (renamed from `src/pages`; Next.js refuses to build if any directory is called `pages`). The four programme pages live in their own folders (`FODE/`, `VET/`, `PostPrimary/`, `BasicEducation/`) with one file per section; the smaller pages are single files.
- `src/components` - shared chrome (`SiteHeader`, `SiteFooter`, `PageHero` and the inner-page banner).
- `src/admin` - admin dashboard pages and shared CRUD components.
- `src/lib/api.ts` - API client and the offline fallback store.
- `src/lib/seedData.ts` - fallback content used by the localStorage store.
- `lib/db.ts` - `mysql2` pool singleton, cached on `globalThis` so hot reloads do not leak connections.
- `lib/auth.ts` - JWT signing, the session cookie, and the `auth_version` revocation check.
- `lib/entities.ts` - the entity allowlist and column map (a security boundary: it is interpolated into SQL).
- `lib/ensure-schema.ts` - idempotent schema self-healing, run by `npm run db:ensure`.
- `backend` - legacy PHP API and database SQL.
- `public/assets` - static public assets.
