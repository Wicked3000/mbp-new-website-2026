import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.API_PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Fail closed: a published default signing key lets anyone mint admin tokens.
if (IS_PRODUCTION && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set when NODE_ENV=production");
}
const JWT_SECRET =
  process.env.JWT_SECRET || "mbp_education_dev_secret_change_me_32chars";
if (!IS_PRODUCTION && !process.env.JWT_SECRET) {
  console.warn(
    "[security] JWT_SECRET is unset - using the public development default. Never do this in production.",
  );
}
const DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(DB);

async function ensurePartnerLogoColumn() {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'partners' AND column_name = 'logo'",
      [DB.database],
    );
    if (Number(rows[0]?.count) === 0)
      await pool.query("ALTER TABLE partners ADD COLUMN logo TEXT DEFAULT NULL");
  } catch (error) {
    console.error("Unable to ensure partners.logo column:", error.message);
  }
}

async function ensureWhatsAppSubscribersTable() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(20) NOT NULL UNIQUE,
      source VARCHAR(120) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);
  } catch (error) {
    console.error("Unable to ensure whatsapp_subscribers table:", error.message);
  }
}

async function ensureSelectionStudentsTable() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS selection_students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      grade_level TINYINT NOT NULL,
      school VARCHAR(180) NOT NULL,
      position_no INT NULL,
      primary_school VARCHAR(180) NOT NULL DEFAULT '',
      surname VARCHAR(120) NOT NULL DEFAULT '',
      first_name VARCHAR(120) NOT NULL DEFAULT '',
      gender VARCHAR(20) NOT NULL DEFAULT '',
      student_name VARCHAR(220) NOT NULL DEFAULT '',
      slf_no VARCHAR(60) NOT NULL DEFAULT '',
      transferred_from VARCHAR(180) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_selection_grade_school (grade_level, school)
    ) ENGINE=InnoDB`);
  } catch (error) {
    console.error("Unable to ensure selection_students table:", error.message);
  }
}

async function ensureSelectionGrade11Columns() {
  const columns = ["capacity", "placed", "cutoff"];
  try {
    for (const column of columns) {
      const [rows] = await pool.query(
        "SELECT COUNT(*) AS count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'selections_grade11' AND column_name = ?",
        [DB.database, column],
      );
      if (Number(rows[0]?.count) === 0)
        await pool.query(`ALTER TABLE selections_grade11 ADD COLUMN ${column} INT NULL`);
    }
  } catch (error) {
    console.error("Unable to ensure selections_grade11 total columns:", error.message);
  }
}

// ensure uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const base = path
      .parse(file.originalname)
      .name.replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 60);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${base}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // SVG is deliberately excluded: it is an XML document that can carry
    // <script>, and uploads are served from this origin, so accepting it is a
    // stored-XSS route into the admin's session.
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeOk =
      /^(image\/(jpeg|png|webp|gif|avif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet)|vnd\.ms-excel|text\/(csv|plain))$)/i.test(
        file.mimetype,
      );
    const extOk = /\.(jpg|jpeg|png|webp|gif|avif|pdf|doc|docx|xls|xlsx|csv|txt)$/i.test(
      file.originalname,
    );
    if (/\.svg$/i.test(file.originalname) || ext === ".svg") {
      return cb(new Error("SVG uploads are not allowed"));
    }
    if (!mimeOk && !extOk) return cb(new Error("Unsupported file type"));
    cb(null, true);
  },
});

const app = express();
app.disable("x-powered-by");

// Reflecting any Origin with credentials lets arbitrary sites drive the admin
// API from a visitor's browser, so only configured origins are allowed.
const DEFAULT_ORIGINS = [
  "http://localhost:8443",
  "http://127.0.0.1:8443",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
const ALLOWED_ORIGINS = new Set(
  (process.env.CORS_ORIGINS || DEFAULT_ORIGINS.join(","))
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
);
app.use(
  cors({
    origin(origin, cb) {
      // Same-origin/tool requests (curl, server-to-server) send no Origin.
      if (!origin) return cb(null, true);
      cb(null, ALLOWED_ORIGINS.has(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  if (IS_PRODUCTION) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
// Uploaded files are user-supplied: never let a browser sniff them into HTML.
app.use(
  "/uploads",
  express.static(uploadDir, {
    setHeaders(res) {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    },
  }),
);

// Fixed-window limiter, enough to blunt credential stuffing and spam without
// adding a dependency or shared state.
const WINDOW_MS = 15 * 60 * 1000;
const buckets = new Map();
function rateLimit({ limit, windowMs = WINDOW_MS, key = (req) => req.ip, message }) {
  return (req, res, next) => {
    const now = Date.now();
    const k = key(req);
    let entry = buckets.get(k);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      buckets.set(k, entry);
    }
    entry.count += 1;
    if (entry.count > limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ error: message || "Too many requests, please try again later" });
    }
    next();
  };
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
}, WINDOW_MS).unref();

function sign(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}
function verify(token) {
  return jwt.verify(token, JWT_SECRET);
}
function auth(req, res, next) {
  const hdr = req.headers.authorization || req.headers["x-authorization"] || "";
  const m = hdr.match(/Bearer\s+(.+)/);
  if (!m) return res.status(401).json({ error: "Missing token" });
  try {
    const p = verify(m[1].trim());
    req.user = p;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// health
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", db: DB.database, time: new Date().toISOString() }),
);
// also support /health.php style for compat
app.get("/health.php", (req, res) =>
  res.json({ status: "ok", db: DB.database, time: new Date().toISOString() }),
);

// auth login
app.post(
  "/api/auth/login",
  rateLimit({ limit: 10, message: "Too many login attempts, please try again later" }),
  async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });
    const [rows] = await pool.query(
      "SELECT id, username, email, role, password_hash FROM users WHERE username=? OR email=? LIMIT 1",
      [username, username],
    );
    const user = rows[0];
    // Async compare keeps a flood of guesses from blocking the event loop, and
    // the placeholder hash keeps the timing similar for unknown usernames.
    const hash = user?.password_hash || "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
    const ok = await bcrypt.compare(String(password), hash);
    if (!user || !ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = sign({ uid: user.id, username: user.username, role: user.role });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
});
app.get("/api/auth/me", auth, (req, res) => res.json({ user: req.user }));

app.post("/api/selections/students/bulk", auth, async (req, res) => {
  const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
  if (!rows.length) return res.status(400).json({ error: "No student rows provided" });
  const values = rows
    .map((row) => ({
      grade_level: Number(row.grade_level),
      school: String(row.school || "").trim(),
      position_no: row.position_no === "" || row.position_no == null ? null : Number(row.position_no),
      primary_school: String(row.primary_school || "").trim(),
      surname: String(row.surname || "").trim(),
      first_name: String(row.first_name || "").trim(),
      gender: String(row.gender || "").trim(),
      student_name: String(row.student_name || "").trim(),
      slf_no: String(row.slf_no || "").trim(),
      transferred_from: String(row.transferred_from || "").trim(),
    }))
    .filter((row) => (row.grade_level === 9 || row.grade_level === 11) && row.school);
  if (!values.length) return res.status(400).json({ error: "Rows must include a grade level and school" });
  const placeholders = values.map(() => "(?,?,?,?,?,?,?,?,?,?)").join(",");
  const params = values.flatMap((row) => [
    row.grade_level,
    row.school,
    row.position_no,
    row.primary_school,
    row.surname,
    row.first_name,
    row.gender,
    row.student_name,
    row.slf_no,
    row.transferred_from,
  ]);
  try {
    await pool.query(
      `INSERT INTO selection_students (grade_level, school, position_no, primary_school, surname, first_name, gender, student_name, slf_no, transferred_from) VALUES ${placeholders}`,
      params,
    );
    res.json({ ok: true, count: values.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save student selection list" });
  }
});

app.post(
  "/api/whatsapp/subscribe",
  rateLimit({ limit: 20, message: "Too many subscriptions from this address" }),
  async (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  const source = String(req.body?.source || "Official announcements").trim();
  if (!/^\+?\d{7,15}$/.test(phone))
    return res.status(400).json({ error: "Enter a valid WhatsApp number" });
  if (!source) return res.status(400).json({ error: "Subscription channel required" });
  try {
    await pool.query(
      "INSERT INTO whatsapp_subscribers (phone, source) VALUES (?, ?) ON DUPLICATE KEY UPDATE source = VALUES(source)",
      [phone, source],
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to save subscription" });
  }
  },
);

// generic map
const MAP = {
  hero_slides: {
    table: "hero_slides",
    cols: ["src", "alt", "sort_order", "is_active"],
  },
  news: {
    table: "news",
    cols: [
      "tag",
      "tag_color",
      "news_date",
      "title",
      "excerpt",
      "img",
      "is_published",
      "is_previous",
    ],
  },
  notices: { table: "notices", cols: ["notice_date", "title", "is_published"] },
  events: {
    table: "events",
    cols: ["month", "day", "title", "event_time", "cat", "color"],
  },
  programs: {
    table: "programs",
    cols: ["code", "label", "level", "description", "color", "accent", "href", "img", "sort_order"],
  },
  stats: { table: "stats", cols: ["value_text", "label", "sub", "sort_order"] },
  districts: {
    table: "districts",
    cols: ["name", "schools", "type", "students"],
  },
  schools: {
    table: "schools",
    cols: ["district_id", "name", "district", "type", "level", "capacity", "enrolled"],
  },
  leadership: {
    table: "leadership",
    cols: ["name", "title", "bio", "icon", "photo", "sort_order"],
  },
  partners: { table: "partners", cols: ["name", "logo", "sort_order"] },
  quick_links: {
    table: "quick_links",
    cols: ["icon", "label", "description", "href", "sort_order"],
  },
  downloads: {
    table: "downloads",
    cols: ["name", "type", "size_text", "category", "description", "file_path"],
  },
  site_settings: {
    table: "site_settings",
    cols: ["skey", "svalue"],
    pk: "skey",
  },
  selections_grade9: {
    table: "selections_grade9",
    cols: ["school", "district", "type", "capacity", "placed", "stream", "cutoff"],
  },
  selections_grade11: {
    table: "selections_grade11",
    cols: [
      "school",
      "district",
      "type",
      "streams_json",
      "placed_json",
      "cutoff_json",
      "capacity",
      "placed",
      "cutoff",
    ],
  },
  selection_students: {
    table: "selection_students",
    cols: [
      "grade_level",
      "school",
      "position_no",
      "primary_school",
      "surname",
      "first_name",
      "gender",
      "student_name",
      "slf_no",
      "transferred_from",
    ],
  },
  contact_messages: {
    table: "contact_messages",
    cols: ["full_name", "phone", "email", "category", "district", "subject", "message", "status"],
  },
  whatsapp_subscribers: {
    table: "whatsapp_subscribers",
    cols: ["phone", "source"],
  },
  users: {
    table: "users",
    cols: ["username", "email", "role"],
    // Never SELECT * here: the table also holds password_hash.
    selectCols: ["id", "username", "email", "role"],
    readOnly: true,
  },
};
// selection_students holds minors' names, SLF numbers and gender, so it is
// deliberately absent: it stays admin-only.
const publicRead = new Set([
  "hero_slides",
  "news",
  "notices",
  "events",
  "programs",
  "stats",
  "districts",
  "schools",
  "leadership",
  "partners",
  "quick_links",
  "downloads",
  "site_settings",
  "selections_grade9",
  "selections_grade11",
]);

app.all("/api/entities", async (req, res) => {
  const entity = req.query.entity;
  // Object.hasOwn, not `MAP[entity]`: a plain lookup would happily accept
  // "constructor"/"__proto__" and build a query against `undefined`.
  if (typeof entity !== "string" || !Object.hasOwn(MAP, entity))
    return res.status(400).json({ error: "Unknown entity", allowed: Object.keys(MAP) });
  const cfg = MAP[entity];
  const table = cfg.table;
  const pk = cfg.pk || "id";
  // Public GETs are limited to the allowlist; every write needs a valid token.
  const needsAuth =
    ["POST", "PUT", "DELETE"].includes(req.method) || !publicRead.has(entity);
  if (needsAuth) {
    const hdr = req.headers.authorization || req.headers["x-authorization"] || "";
    const m = hdr.match(/Bearer\s+(.+)/);
    if (!m) return res.status(401).json({ error: "Missing token" });
    try {
      verify(m[1].trim());
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }
  if (["POST", "PUT", "DELETE"].includes(req.method) && cfg.readOnly)
    return res.status(403).json({ error: "Read only" });
  try {
    if (req.method === "GET") {
      if (entity === "site_settings") {
        const [rows] = await pool.query("SELECT skey,svalue FROM site_settings");
        const map = {};
        rows.forEach((r) => (map[r.skey] = r.svalue));
        return res.json({ data: map });
      }
      // Entities with a selectCols allowlist (e.g. users) must never fall back
      // to SELECT *, which would hand back password_hash.
      const selectList = cfg.selectCols
        ? cfg.selectCols.map((c) => `\`${c}\``).join(",")
        : "*";
      if (req.query.id) {
        const [rows] = await pool.query(
          `SELECT ${selectList} FROM \`${table}\` WHERE \`${pk}\`=? LIMIT 1`,
          [req.query.id],
        );
        if (!rows[0]) return res.status(404).json({ error: "Not found" });
        return res.json({ data: rows[0] });
      }
      const [rows] = await pool.query(
        `SELECT ${selectList} FROM \`${table}\` ORDER BY \`${pk}\` ASC`,
      );
      return res.json({ data: rows });
    }
    if (req.method === "POST") {
      if (entity === "site_settings") {
        const { skey, svalue } = req.body;
        if (!skey) return res.status(400).json({ error: "skey required" });
        await pool.query(
          "INSERT INTO site_settings (skey,svalue) VALUES (?,?) ON DUPLICATE KEY UPDATE svalue=VALUES(svalue)",
          [skey, svalue],
        );
        return res.json({ ok: true });
      }
      const payload = req.body;
      const cols = cfg.cols.filter((c) => payload[c] !== undefined);
      if (!cols.length) return res.status(400).json({ error: "No fields" });
      const vals = cols.map((c) => payload[c]);
      const sql = `INSERT INTO \`${table}\` (${cols.map((c) => "`" + c + "`").join(",")}) VALUES (${cols.map(() => "?").join(",")})`;
      const [r] = await pool.query(sql, vals);
      return res.status(201).json({ id: r.insertId });
    }
    if (req.method === "PUT") {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: "id required" });
      if (entity === "site_settings") {
        const { svalue } = req.body;
        await pool.query("UPDATE site_settings SET svalue=? WHERE skey=?", [svalue, id]);
        return res.json({ ok: true });
      }
      const payload = req.body;
      const sets = cfg.cols.filter((c) => payload[c] !== undefined).map((c) => "`" + c + "`=?");
      const vals = cfg.cols.filter((c) => payload[c] !== undefined).map((c) => payload[c]);
      if (!sets.length) return res.status(400).json({ error: "No fields" });
      vals.push(id);
      const [r] = await pool.query(
        `UPDATE \`${table}\` SET ${sets.join(",")} WHERE \`${pk}\`=?`,
        vals,
      );
      return res.json({ ok: true, affected: r.affectedRows });
    }
    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: "id required" });
      await pool.query(`DELETE FROM \`${table}\` WHERE \`${pk}\`=?`, [id]);
      return res.json({ ok: true });
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    // Log the detail server-side; never hand SQL text or table names to callers.
    console.error(`[${entity}] ${req.method} failed:`, e);
    res.status(500).json({ error: "DB error" });
  }
});
// compat: /entities.php
app.all("/entities.php", (req, res) => {
  req.url = "/api/entities" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");
  app.handle(req, res);
});
app.all("/api/entities.php", (req, res) => {
  req.url = "/api/entities" + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");
  app.handle(req, res);
});

// contact public
app.post(
  "/api/contact",
  rateLimit({ limit: 10, message: "Too many messages, please try again later" }),
  async (req, res) => {
  const { full_name, phone, email, category, district, subject, message } = req.body || {};
  if (!full_name || !email || !subject || !message)
    return res.status(400).json({ error: "Missing required fields" });
  await pool.query(
    "INSERT INTO contact_messages (full_name,phone,email,category,district,subject,message) VALUES (?,?,?,?,?,?,?)",
    [
      full_name,
      phone || "",
      email,
      category || "General Enquiry",
      district || "",
      subject,
      message,
    ],
  );
  res.json({ ok: true });
  },
);

app.post("/contact.php", rateLimit({ limit: 10 }), (req, res) => {
  req.url = "/api/contact";
  app.handle(req, res);
});

// dashboard
app.get("/api/stats/dashboard", auth, async (req, res) => {
  const [[n]] = await pool.query("SELECT COUNT(*) c FROM news");
  const [[no]] = await pool.query("SELECT COUNT(*) c FROM notices");
  const [[ev]] = await pool.query("SELECT COUNT(*) c FROM events");
  const [[mn]] = await pool.query("SELECT COUNT(*) c FROM contact_messages WHERE status='new'");
  const [[mt]] = await pool.query("SELECT COUNT(*) c FROM contact_messages");
  const [[di]] = await pool.query("SELECT COUNT(*) c FROM districts");
  const [recent] = await pool.query(
    "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5",
  );
  res.json({
    data: {
      news: n.c,
      notices: no.c,
      events: ev.c,
      messages_new: mn.c,
      messages_total: mt.c,
      districts: di.c,
      schools: 312,
      recent_messages: recent,
    },
  });
});

// upload
// multer signals rejected files through errors; answer with a clean 400.
app.post("/api/upload", auth, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err)
      return res
        .status(400)
        .json({ error: err.message || "Upload rejected", code: err.code });
    if (!req.file) return res.status(400).json({ error: "No file" });
    // Relative URL: hardcoding localhost leaked the internal host and broke
    // every deployed environment.
    const rel = `/uploads/${req.file.filename}`;
    res.json({ ok: true, url: rel, filename: req.file.filename, path: rel });
  });
});
app.post("/upload.php", (req, res) => {
  req.url = "/api/upload";
  app.handle(req, res);
});

// also support legacy paths: /auth/login.php etc
app.post("/auth/login.php", (req, res) => {
  req.url = "/api/auth/login";
  app.handle(req, res);
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));

Promise.all([
  ensurePartnerLogoColumn(),
  ensureWhatsAppSubscribersTable(),
  ensureSelectionStudentsTable(),
  ensureSelectionGrade11Columns(),
]).finally(() => {
  app.listen(PORT, () =>
    console.log(
      `MBP API (Node) running on http://localhost:${PORT} - DB ${DB.host}:${DB.port}/${DB.database}`,
    ),
  );
});
