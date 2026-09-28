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

All sections fall back to hardcoded data if MySQL is offline (localStorage mock), so the site works in preview without XAMPP.

## XAMPP / phpMyAdmin Setup

1. **Start XAMPP** → Start Apache + MySQL.
2. **Import DB**: http://localhost/phpmyadmin → Import `backend/database/mbp_education.sql` (creates `mbp_education` with 18 tables + seed data).
3. **Deploy API**: Copy `backend/api` → `C:\xampp\htdocs\mbp-api` (so `http://localhost/mbp-api/health.php` returns `{"status":"ok"}`).
4. **Configure DB** (`backend/api/config/database.php`): default `root` / `""` password. Update if you set a password.
5. **Frontend env** (`.env`): `VITE_API_BASE=http://localhost/mbp-api`
6. **Run site**: `npm run dev` → http://localhost:8443
7. **Set the admin password**: the seed deliberately creates the `admin` account
   with no password, so nothing works until you do this:

   ```bash
   npm run admin:password -- admin 'a long unique passphrase'
   ```

   The command also signs out any existing session. Afterwards, change it any
   time from **Admin → Settings → Change Password**.

## API

- `POST /auth/login.php` → {token, user}
- `POST /auth/change-password.php` (auth) → rotates the password, retires every
  other session and returns a fresh token
- `GET /entities.php?entity=news` (public for hero/news/notices/events/programs/stats/districts/schools/leadership/partners/quick_links/downloads/site_settings/selections; auth for users, contact_messages, whatsapp_subscribers and selection_students)
- `POST /entities.php?entity=...` / `PUT /entities.php?entity=...&id=1` / `DELETE /entities.php?entity=...&id=1` (auth required)
- `POST /contact.php` (public)
- `GET /stats/dashboard.php` (auth)
- `POST /upload.php` (auth) → {url, filename}
- CORS is an allowlist: set `CORS_ORIGINS` to the origins that may call the API.

## Dev Fallback

If API unreachable, `src/lib/api.ts` uses `localStorage` (`mbp_mock_db_v1`) with the same seed data. Admin CRUD still works locally. Real errors (a 401, a 500, a rejected file) are reported instead of being written to the local store.

## Security Notes

- Auth is a stateless HS256 JWT, valid for one day. Each token carries the user's
  `auth_version`; changing a password increments it, so tokens issued from the
  old password stop working immediately.
- `JWT_SECRET` must be set in `.env` (32+ characters) - the API refuses to start
  under `NODE_ENV=production` without it. Never commit a real `.env`.
- Set `CORS_ORIGINS` to the site's real origins. Behind Apache or nginx set
  `TRUSTED_PROXY=1` (PHP) or `TRUST_PROXY=1` (Node) so rate limiting sees the
  real client address instead of the proxy's.
- The public site content is world-readable by design; anything holding personal
  data (`contact_messages`, `whatsapp_subscribers`, `selection_students`,
  `users`) requires a token, and `selection_students` holds minors' details.
- Serve everything over HTTPS in production and add rate limiting at the reverse
  proxy as well.
- `npm test` covers the API's auth, CORS, upload and CRUD guards.
