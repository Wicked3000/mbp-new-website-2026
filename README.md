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

The seed data creates an initial admin account. Set your own credentials before the
first login, and set `JWT_SECRET` in `.env` to a random value of at least 32 characters:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never deploy with the seeded account or the published development `JWT_SECRET`.

## Useful Commands

```bash
npm run build
npx tsc --noEmit
npm run format
```

## Project Structure

- `src/App.tsx` - main site routes and home page sections.
- `src/pages` - public page components.
- `src/admin` - admin dashboard pages and shared CRUD components.
- `server/index.js` - Node API and database integration.
- `backend` - legacy PHP API and database SQL.
- `assets` - source images used by Vite imports.
- `public/assets` - static public assets.
