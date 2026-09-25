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
7. **Admin**: http://localhost:8443/admin/login → user `admin` / pass `password` → change after login (bcrypt hash in `users` table).

## API

- `POST /auth/login.php` → {token, user}
- `GET /entities.php?entity=news` (public for hero/news/notices/events/programs/stats/districts/partners/quick_links; auth for others)
- `POST /entities.php?entity=...` / `PUT /entities.php?entity=...&id=1` / `DELETE /entities.php?entity=...&id=1` (auth required)
- `POST /contact.php` (public)
- `GET /stats/dashboard.php` (auth)
- CORS allowed for localhost:8443/5173/3000.

## Dev Fallback

If API unreachable, `src/lib/api.ts` uses `localStorage` (`mbp_mock_db_v1`) with the same seed data. Admin CRUD still works locally.

## Security Notes

- Current auth is simple JWT HMAC (HS256) without DB sessions; replace `jwt_secret` in `backend/api/config/auth.php` for production and use `password_hash` for users table.
- Add rate limiting + HTTPS in production; never commit `.env` with real secrets.
