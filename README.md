# Milne Bay Province Division of Education Website

React + Vite + Tailwind CSS website for the Milne Bay Province Division of Education, with a Node/MySQL API, legacy PHP API support, and an admin dashboard.

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

4. Start the frontend and API together:

   ```bash
   npm run dev:all
   ```

5. Open `http://localhost:8443`.

To run only the frontend:

```bash
npm run dev
```

To run only the Node API:

```bash
npm run dev:api
```

## Admin Dashboard

Open `http://localhost:8443/admin/login`.

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
npm run dev:api
npx tsc --noEmit
npm test
npm run format
npm run admin:password -- admin 'a long unique passphrase'
```

## The Two API Clients

The browser can be served by either the Node API (`server/`) or the legacy PHP
API (`backend/api/`). Both keep their own copy of the entity map, and
`server/app.js` is the single source of truth. After adding an entity to
`ENTITY_MAP`, regenerate the PHP copy and confirm they agree:

```bash
npm run sync:php
npm run verify:sync
```

Skipping this is what broke the Home Page admin: the PHP map was still the
original 19 entities, so every page-section request answered
`400 Unknown entity` even though the tables were right there in the database.

## Project Structure

- `src/App.tsx` - site routes, the admin auth guard and the skip link.
- `src/home` - home page sections, one component per file.
- `src/pages` - public pages. The four programme pages live in their own folders (`FODE/`, `VET/`, `PostPrimary/`, `BasicEducation/`) with one file per section; the smaller pages are single files.
- `src/components` - shared chrome (`SiteHeader`, `SiteFooter`, `PageHero` and the inner-page banner).
- `src/admin` - admin dashboard pages and shared CRUD components.
- `src/lib/api.ts` - API client and the offline fallback store.
- `src/lib/seedData.ts` - fallback content used by the localStorage store.
- `server/app.js` - Express app: routes, auth, rate limiting (testable).
- `server/index.js` - Node API entrypoint, schema self-healing, listener.
- `backend` - legacy PHP API and database SQL.
- `assets` - source images used by Vite imports.
- `public/assets` - static public assets.
