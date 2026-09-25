# MBP Education Backend — XAMPP Setup

## 1. XAMPP / phpMyAdmin

1. Start **Apache** and **MySQL** in XAMPP Control Panel.
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Import `backend/database/mbp_education.sql`
   - Or create DB `mbp_education` manually and import.
4. Verify user: `admin / password` (change after login).

## 2. Copy API to htdocs

Copy `backend/api` to your XAMPP htdocs:

```
C:\xampp\htdocs\mbp-api  -> contains all files from backend/api/
```

Then API base is `http://localhost/mbp-api`.

Test: `http://localhost/mbp-api/health.php` should return `{status:"ok"}`

## 3. Configure DB connection

Edit `backend/api/config/database.php`:

```php
private $host = "localhost";
private $db = "mbp_education";
private $user = "root";
private $pass = "";  // default XAMPP root has no password
private $charset = "utf8mb4";
```

If you set a MySQL password, update `$pass`.

## 4. Frontend .env

Create `.env` in project root:

```
VITE_API_BASE=http://localhost/mbp-api
```

Admin will auto fallback to localStorage mock if API unreachable (useful for preview without XAMPP).

## 5. Admin Login

http://localhost:8443/admin/login

- user: `admin`
- pass: `password`

JWT is stateless (not DB session). For production, replace `jwt_secret` in `auth.php`.
