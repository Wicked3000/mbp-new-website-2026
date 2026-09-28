import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Uploads are written into public/uploads, which is the single copy of that
// content for the whole project.
//
// It has to be this directory. The browser is handed a /uploads/... URL, and
// that path is served statically from public/ - by Vite in development and from
// dist/ in a build. Writing anywhere else means the file is stored somewhere the
// site never reads, so an image uploaded through the admin 404s in the browser
// while the API reports success. public/ is also what gets committed and
// deployed, so an upload reaches production without a second copy step.
export const UPLOAD_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "uploads",
);

// Public site content. selection_students holds minors' names, SLF numbers and
// gender, so it is deliberately absent: it stays admin-only.
export const PUBLIC_READ = new Set([
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

  "basic_hero",
  "basic_overview",
  "basic_overview_cards",
  "basic_overview_features",
  "basic_overview_stats",
  "basic_curriculum",
  "basic_initiatives",
  "basic_support",
  "basic_support_contact",
  "basic_faq",
  "basic_section_headings",
  "post_hero",
  "post_overview",
  "post_overview_cards",
  "post_overview_features",
  "post_overview_stats",
  "post_streams",
  "post_assessment",
  "post_pathways",
  "post_initiatives",
  "post_support",
  "post_support_contact",
  "post_faq",
  "post_section_headings",
  "vet_hero",
  "vet_overview",
  "vet_overview_cards",
  "vet_overview_features",
  "vet_overview_stats",
  "vet_programs",
  "vet_centres",
  "vet_centre_names",
  "vet_partners",
  "vet_apprenticeship",
  "vet_initiatives",
  "vet_enrolment_steps",
  "vet_intake_dates",
  "vet_support",
  "vet_support_contact",
  "vet_faq",
  "vet_section_headings",
  "fode_hero",
  "fode_overview",
  "fode_overview_cards",
  "fode_overview_features",
  "fode_overview_stats",
  "fode_programs",
  "fode_centres",
  "fode_delivery_methods",
  "fode_app_callout",
  "fode_enrolment_steps",
  "fode_key_dates",
  "fode_support",
  "fode_support_contact",
  "fode_initiatives",
  "fode_faq",
  "fode_section_headings",
  "home_mission",
  "home_mission_points",
  "home_selection_banner",
  "home_cta",
  "home_cta_channels",]);

export const ENTITY_MAP = {
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
    cols: ["name", "capital", "schools", "type", "students", "img", "sort_order"],
  },
  schools: {
    table: "schools",
    cols: [
      "district_id", "name", "district", "type", "level", "capacity", "enrolled",
      "img", "head_teacher", "contact", "location", "male", "female", "teachers",
      "staff", "lat", "lng", "email", "address", "alt_phone", "contact_person",
      "code", "established", "day_boarding", "category", "classrooms",
      "land_hectares", "has_library", "has_computer_lab", "has_science_lab",
      "has_sports_field", "has_boarding", "principal", "teachers_male",
      "teachers_female", "untrained_teachers", "admin_officers", "support_staff",
      "streams", "exam_centre", "extracurricular", "day_students", "boarders",
      "transport", "uniform", "fees", "notes",
    ],
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
  downloads: { table: "downloads", cols: ["name", "type", "size_text", "category", "description", "file_path", "program", "sort_order"] },
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
    // Never SELECT * here: the table also holds password_hash and auth_version.
    selectCols: ["id", "username", "email", "role"],
    readOnly: true,
  },

  // Page sections made admin-editable. The tables are created on boot by the
  // ensure* helpers in server/index.js.
  basic_hero: { table: "basic_hero", cols: ["eyebrow", "title", "subtitle", "description", "banner", "alt", "sort_order"] },
  basic_overview: { table: "basic_overview", cols: ["eyebrow", "heading", "intro", "body", "features_title", "sort_order"] },
  basic_overview_cards: { table: "basic_overview_cards", cols: ["icon", "title", `desc`, "sort_order"] },
  basic_overview_features: { table: "basic_overview_features", cols: ["feature", "sort_order"] },
  basic_overview_stats: { table: "basic_overview_stats", cols: ["value_text", "label", "color", "sort_order"] },
  basic_curriculum: { table: "basic_curriculum", cols: ["area", "grades", `desc`, "icon", "sort_order"] },
  basic_initiatives: { table: "basic_initiatives", cols: ["title", `desc`, "icon", "status", "color", "sort_order"] },
  basic_support: { table: "basic_support", cols: ["icon", "title", `desc`, "sort_order"] },
  basic_support_contact: { table: "basic_support_contact", cols: ["heading", "body", "phone_label", "phone_value", "email_label", "email_value", "office_label", "office_value", "button_label", "button_href", "sort_order"] },
  basic_faq: { table: "basic_faq", cols: ["q", "a", "sort_order"] },
  basic_section_headings: { table: "basic_section_headings", cols: ["skey", "eyebrow", "heading", "blurb", "sort_order"] },
  post_hero: { table: "post_hero", cols: ["eyebrow", "title", "subtitle", "description", "banner", "alt", "sort_order"] },
  post_overview: { table: "post_overview", cols: ["eyebrow", "heading", "intro", "body", "features_title", "sort_order"] },
  post_overview_cards: { table: "post_overview_cards", cols: ["icon", "title", `desc`, "sort_order"] },
  post_overview_features: { table: "post_overview_features", cols: ["feature", "sort_order"] },
  post_overview_stats: { table: "post_overview_stats", cols: ["value_text", "label", "color", "sort_order"] },
  post_streams: { table: "post_streams", cols: ["name", "grades", "subjects", "icon", "color", "sort_order"] },
  post_assessment: { table: "post_assessment", cols: ["icon", "heading", "bullet", "sort_order"] },
  post_pathways: { table: "post_pathways", cols: ["title", `desc`, "icon", "color", "stats", "sort_order"] },
  post_initiatives: { table: "post_initiatives", cols: ["title", `desc`, "icon", "status", "color", "sort_order"] },
  post_support: { table: "post_support", cols: ["icon", "title", `desc`, "sort_order"] },
  post_support_contact: { table: "post_support_contact", cols: ["heading", "body", "phone_label", "phone_value", "email_label", "email_value", "office_label", "office_value", "button_label", "button_href", "sort_order"] },
  post_faq: { table: "post_faq", cols: ["q", "a", "sort_order"] },
  post_section_headings: { table: "post_section_headings", cols: ["skey", "eyebrow", "heading", "blurb", "sort_order"] },
  vet_hero: { table: "vet_hero", cols: ["eyebrow", "title", "subtitle", "description", "banner", "alt", "sort_order"] },
  vet_overview: { table: "vet_overview", cols: ["eyebrow", "heading", "intro", "body", "features_title", "sort_order"] },
  vet_overview_cards: { table: "vet_overview_cards", cols: ["icon", "title", `desc`, "sort_order"] },
  vet_overview_features: { table: "vet_overview_features", cols: ["feature", "sort_order"] },
  vet_overview_stats: { table: "vet_overview_stats", cols: ["value_text", "label", "color", "sort_order"] },
  vet_programs: { table: "vet_programs", cols: ["code", "name", "duration", "level", "trades", "icon", "color", "sort_order"] },
  vet_centres: { table: "vet_centres", cols: ["name", "district", "status", "programs", "capacity", "facilities", "icon", "sort_order"] },
  vet_centre_names: { table: "vet_centre_names", cols: ["name", "sort_order"] },
  vet_partners: { table: "vet_partners", cols: ["name", "sector", "programs", "icon", "sort_order"] },
  vet_apprenticeship: { table: "vet_apprenticeship", cols: ["icon", "heading", "body", "bullet", "sort_order"] },
  vet_initiatives: { table: "vet_initiatives", cols: ["title", `desc`, "icon", "status", "color", "sort_order"] },
  vet_enrolment_steps: { table: "vet_enrolment_steps", cols: ["step", "title", `desc`, "sort_order"] },
  vet_intake_dates: { table: "vet_intake_dates", cols: ["label", "date_text", "sort_order"] },
  vet_support: { table: "vet_support", cols: ["icon", "title", `desc`, "sort_order"] },
  vet_support_contact: { table: "vet_support_contact", cols: ["heading", "body", "phone_label", "phone_value", "email_label", "email_value", "office_label", "office_value", "button_label", "button_href", "sort_order"] },
  vet_faq: { table: "vet_faq", cols: ["q", "a", "sort_order"] },
  vet_section_headings: { table: "vet_section_headings", cols: ["skey", "eyebrow", "heading", "blurb", "sort_order"] },
  fode_hero: { table: "fode_hero", cols: ["eyebrow", "title", "subtitle", "description", "banner", "alt", "sort_order"] },
  fode_overview: { table: "fode_overview", cols: ["eyebrow", "heading", "intro", "body", "features_title", "sort_order"] },
  fode_overview_cards: { table: "fode_overview_cards", cols: ["icon", "title", `desc`, "sort_order"] },
  fode_overview_features: { table: "fode_overview_features", cols: ["feature", "sort_order"] },
  fode_overview_stats: { table: "fode_overview_stats", cols: ["value_text", "label", "color", "sort_order"] },
  fode_programs: { table: "fode_programs", cols: ["name", "level", "duration", "subjects", "target", "icon", "color", "sort_order"] },
  fode_centres: { table: "fode_centres", cols: ["name", "district", "centre_type", "students", "facilities", "coordinator", "icon", "sort_order"] },
  fode_delivery_methods: { table: "fode_delivery_methods", cols: ["name", `desc`, "icon", "availability", "sort_order"] },
  fode_app_callout: { table: "fode_app_callout", cols: ["icon", "heading", "body", "bullet", "sort_order"] },
  fode_enrolment_steps: { table: "fode_enrolment_steps", cols: ["step", "title", `desc`, "sort_order"] },
  fode_key_dates: { table: "fode_key_dates", cols: ["label", "date_text", "sort_order"] },
  fode_support: { table: "fode_support", cols: ["icon", "title", `desc`, "sort_order"] },
  fode_support_contact: { table: "fode_support_contact", cols: ["heading", "body", "phone_label", "phone_value", "email_label", "email_value", "whatsapp_label", "whatsapp_value", "office_label", "office_value", "button_label", "button_href", "sort_order"] },
  fode_initiatives: { table: "fode_initiatives", cols: ["title", `desc`, "icon", "status", "color", "sort_order"] },
  fode_faq: { table: "fode_faq", cols: ["q", "a", "sort_order"] },
  fode_section_headings: { table: "fode_section_headings", cols: ["skey", "eyebrow", "heading", "blurb", "sort_order"] },
  home_mission: { table: "home_mission", cols: ["eyebrow", "heading", "heading_accent", `para1`, `para2`, "image", "image_alt", "badge_value", "badge_label", "badge_sub", "button_label", "button_href", "sort_order"] },
  home_mission_points: { table: "home_mission_points", cols: ["feature", "sort_order"] },
  home_selection_banner: { table: "home_selection_banner", cols: ["icon", "title", "badge", "body", "primary_label", "primary_href", "secondary_label", "secondary_href", "sort_order"] },
  home_cta: { table: "home_cta", cols: ["badge", "heading", "body", "sub_body", "image", "image_alt", "tagline", "form_title", "form_body", "phone_label", "phone_placeholder", "channel_label", "channel_prompt", "button_label", "button_loading_label", "response_note", "sort_order"] },
  home_cta_channels: { table: "home_cta_channels", cols: ["name", "sort_order"] },
};

export const DEFAULT_ORIGINS = [
  "http://localhost:8443",
  "http://127.0.0.1:8443",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;
export const MIN_PASSWORD_LENGTH = 12;

const ALLOWED_UPLOAD_MIME =
  /^(image\/(jpeg|png|webp|gif|avif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet)|vnd\.ms-excel|text\/(csv|plain)))$/i;
const ALLOWED_UPLOAD_EXT = /\.(jpg|jpeg|png|webp|gif|avif|pdf|doc|docx|xls|xlsx|csv|txt)$/i;

// Fixed-window limiter, enough to blunt credential stuffing and spam without
// adding a dependency or shared state.
const WINDOW_MS = 15 * 60 * 1000;

function createRateLimiter() {
  const buckets = new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }, WINDOW_MS);
  timer.unref?.();
  return function rateLimit({ limit, windowMs = WINDOW_MS, key = (req) => req.ip, message }) {
    return (req, res, next) => {
      const now = Date.now();
      const k = `${req.method}:${req.path}:${key(req)}`;
      let entry = buckets.get(k);
      if (!entry || now > entry.resetAt) {
        entry = { count: 0, resetAt: now + windowMs };
        buckets.set(k, entry);
      }
      entry.count += 1;
      if (entry.count > limit) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        res.setHeader("Retry-After", String(retryAfter));
        return res
          .status(429)
          .json({ error: message || "Too many requests, please try again later" });
      }
      next();
    };
  };
}

// Re-point a legacy PHP-style path at its modern equivalent while keeping the
// query string, so the browser client can keep using the documented .php routes.
function alias(app, from, to) {
  app.all(from, (req, res) => {
    const q = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    req.url = to + q;
    app.handle(req, res);
  });
}

export function createApp({
  pool,
  jwtSecret,
  allowedOrigins = DEFAULT_ORIGINS,
  isProduction = false,
  dbName = "mbp_education",
  uploadDir = UPLOAD_DIR,
  logger = console,
}) {
  if (!jwtSecret) throw new Error("createApp requires a jwtSecret");

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
    limits: { fileSize: UPLOAD_MAX_BYTES },
    fileFilter: (req, file, cb) => {
      // SVG is deliberately excluded: it is an XML document that can carry
      // <script>, and uploads are served from this origin, so accepting it is a
      // stored-XSS route into the admin's session.
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === ".svg") return cb(new Error("SVG uploads are not allowed"));
      if (!ALLOWED_UPLOAD_MIME.test(file.mimetype) && !ALLOWED_UPLOAD_EXT.test(file.originalname))
        return cb(new Error("Unsupported file type"));
      cb(null, true);
    },
  });

  const app = express();
  app.disable("x-powered-by");
  // Behind Apache/nginx the client IP arrives in X-Forwarded-For; without this
  // every request shares one bucket and one admin throttles the whole site.
  if (process.env.TRUST_PROXY) app.set("trust proxy", process.env.TRUST_PROXY);

  // Reflecting any Origin with credentials lets arbitrary sites drive the admin
  // API from a visitor's browser, so only configured origins are allowed.
  const allowList = new Set(allowedOrigins);
  app.use(
    cors({
      origin(origin, cb) {
        // Same-origin/tool requests (curl, server-to-server) send no Origin.
        if (!origin) return cb(null, true);
        cb(null, allowList.has(origin));
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
    if (isProduction) {
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

  const rateLimit = createRateLimiter();
  const sign = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
  const verify = (token) => jwt.verify(token, jwtSecret);

  function bearer(req) {
    const hdr = req.headers.authorization || req.headers["x-authorization"] || "";
    const m = hdr.match(/Bearer\s+(.+)/);
    return m ? m[1].trim() : null;
  }

  // users.auth_version is what makes a password change revoke live tokens. It is
  // added by the boot migration, but a database the app cannot ALTER (shared
  // hosting) must still log in, so probe once and remember the answer.
  let authVersionColumn = null;
  async function hasAuthVersionColumn() {
    if (authVersionColumn !== null) return authVersionColumn;
    try {
      await pool.query("SELECT auth_version FROM users LIMIT 1");
      authVersionColumn = true;
    } catch (error) {
      authVersionColumn = false;
      logger.warn(
        "[security] users.auth_version is unavailable, so password changes cannot revoke existing tokens:",
        error.message,
      );
    }
    return authVersionColumn;
  }

  // Returns the claims, or null after answering 401. Bumping the user's
  // auth_version (which a password change does) invalidates tokens that were
  // already issued.
  async function requireAuth(req, res) {
    const raw = bearer(req);
    if (!raw) {
      res.status(401).json({ error: "Missing token" });
      return null;
    }
    let claims;
    try {
      claims = verify(raw);
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
      return null;
    }
    if (claims.ver !== undefined && (await hasAuthVersionColumn())) {
      try {
        const [rows] = await pool.query("SELECT auth_version FROM users WHERE id=? LIMIT 1", [
          claims.uid,
        ]);
        if (Number(rows[0]?.auth_version ?? 1) !== Number(claims.ver)) {
          res.status(401).json({ error: "Session revoked, please sign in again" });
          return null;
        }
      } catch (error) {
        // Fail closed: without this check a revoked admin token stays usable.
        logger.error("Unable to verify token version:", error.message);
        res.status(503).json({ error: "Session verification unavailable" });
        return null;
      }
    }
    return claims;
  }

  const auth = async (req, res, next) => {
    const claims = await requireAuth(req, res);
    if (!claims) return;
    req.user = claims;
    next();
  };

  // health
  const health = (req, res) =>
    res.json({ status: "ok", db: dbName, time: new Date().toISOString() });
  app.get("/api/health", health);
  // also support /health.php style for compat
  app.get("/health.php", health);

  const USER_COLUMNS = "id, username, email, role, password_hash";

  async function findUser(where, params) {
    const versioned = await hasAuthVersionColumn();
    const [rows] = await pool.query(
      `SELECT ${USER_COLUMNS}${versioned ? ", auth_version" : ""} FROM users WHERE ${where} LIMIT 1`,
      params,
    );
    return rows[0];
  }

  function publicUserOf(user) {
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  function tokenFor(user) {
    const ver = user.auth_version === undefined ? undefined : Number(user.auth_version);
    return sign({ uid: user.id, ...publicUserOf(user), ...(ver ? { ver } : {}) });
  }

  // auth login
  app.post(
    "/api/auth/login",
    rateLimit({ limit: 10, message: "Too many login attempts, please try again later" }),
    async (req, res) => {
      const { username, password } = req.body || {};
      if (!username || !password)
        return res.status(400).json({ error: "Username and password required" });
      let user;
      try {
        user = await findUser("username=? OR email=?", [username, username]);
      } catch (error) {
        logger.error("login lookup failed:", error.message);
        return res.status(500).json({ error: "Unable to sign in right now" });
      }
      // Async compare keeps a flood of guesses from blocking the event loop, and
      // the placeholder hash keeps the timing similar for unknown usernames.
      // An empty password_hash is the seeded "locked account" state, not a
      // password that happens to be blank.
      const hash =
        user?.password_hash || "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
      const ok = await bcrypt.compare(String(password), hash);
      if (!user || !ok) {
        // The seeded account ships without a password; say so instead of leaving
        // the operator staring at a generic rejection.
        if (user && !user.password_hash)
          return res.status(401).json({
            error: isProduction
              ? "Invalid credentials"
              : `This account has no password yet. Run: npm run admin:password -- ${user.username} 'a long unique passphrase'`,
          });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ token: tokenFor(user), user: publicUserOf(user) });
    },
  );
  app.get("/api/auth/me", auth, (req, res) => res.json({ user: req.user }));

  // Password rotation. The seeded admin account is a published bcrypt hash, so
  // this is the supported way to replace it and to end existing sessions.
  app.post("/api/auth/change-password", auth, async (req, res) => {
    const current = String(req.body?.current_password || "");
    const next_ = String(req.body?.new_password || "");
    if (!current || !next_) return res.status(400).json({ error: "Both passwords are required" });
    if (next_.length < MIN_PASSWORD_LENGTH)
      return res
        .status(400)
        .json({ error: `Use at least ${MIN_PASSWORD_LENGTH} characters for the new password` });
    if (current === next_)
      return res.status(400).json({ error: "Choose a password you have not used here before" });
    try {
      const user = await findUser("id=?", [req.user.uid]);
      if (!user) return res.status(404).json({ error: "Account not found" });
      if (!(await bcrypt.compare(current, user.password_hash || "")))
        return res.status(401).json({ error: "Current password is incorrect" });
      if (await bcrypt.compare(next_, user.password_hash || ""))
        return res.status(400).json({ error: "Choose a different password" });
      const versioned = await hasAuthVersionColumn();
      const hash = await bcrypt.hash(next_, 10);
      await pool.query("UPDATE users SET password_hash=? WHERE id=?", [hash, user.id]);
      // Bumping the version retires every token minted from the old password.
      const version = Number(user.auth_version ?? 1) + 1;
      if (versioned)
        await pool.query("UPDATE users SET auth_version=? WHERE id=?", [version, user.id]);
      res.json({
        ok: true,
        // Fresh token so the admin stays signed in; every earlier token is dead.
        token: tokenFor({ ...user, auth_version: versioned ? version : undefined }),
        user: publicUserOf(user),
      });
    } catch (error) {
      logger.error("change-password failed:", error);
      res.status(500).json({ error: "Unable to update the password" });
    }
  });

  app.post("/api/selections/students/bulk", auth, async (req, res) => {
    const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
    if (!rows.length) return res.status(400).json({ error: "No student rows provided" });
    const values = rows
      .map((row) => ({
        grade_level: Number(row.grade_level),
        school: String(row.school || "").trim(),
        position_no:
          row.position_no === "" || row.position_no == null ? null : Number(row.position_no),
        primary_school: String(row.primary_school || "").trim(),
        surname: String(row.surname || "").trim(),
        first_name: String(row.first_name || "").trim(),
        gender: String(row.gender || "").trim(),
        student_name: String(row.student_name || "").trim(),
        slf_no: String(row.slf_no || "").trim(),
        transferred_from: String(row.transferred_from || "").trim(),
      }))
      .filter((row) => (row.grade_level === 9 || row.grade_level === 11) && row.school);
    if (!values.length)
      return res.status(400).json({ error: "Rows must include a grade level and school" });
    // Cap the batch so one request cannot pin the connection pool on a huge
    // paste of pasted-together CSV rows.
    const CHUNK = 500;
    let count = 0;
    for (let i = 0; i < values.length; i += CHUNK) {
      const chunk = values.slice(i, i + CHUNK);
      const placeholders = chunk.map(() => "(?,?,?,?,?,?,?,?,?,?)").join(",");
      const params = chunk.flatMap((row) => [
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
      await pool.query(
        `INSERT INTO selection_students (grade_level, school, position_no, primary_school, surname, first_name, gender, student_name, slf_no, transferred_from) VALUES ${placeholders}`,
        params,
      );
      count += chunk.length;
    }
    res.json({ ok: true, count });
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
        logger.error("whatsapp subscribe failed:", error.message);
        res.status(500).json({ error: "Unable to save subscription" });
      }
    },
  );

  // generic map
  app.all("/api/entities", async (req, res) => {
    const entity = req.query.entity;
    // Object.hasOwn, not `MAP[entity]`: a plain lookup would happily accept
    // "constructor"/"__proto__" and build a query against `undefined`.
    if (typeof entity !== "string" || !Object.hasOwn(ENTITY_MAP, entity))
      return res.status(400).json({ error: "Unknown entity", allowed: Object.keys(ENTITY_MAP) });
    const cfg = ENTITY_MAP[entity];
    const table = cfg.table;
    const pk = cfg.pk || "id";
    const isWrite = ["POST", "PUT", "DELETE"].includes(req.method);
    // Public GETs are limited to the allowlist; every write needs a valid token.
    if (isWrite || !PUBLIC_READ.has(entity)) {
      const claims = await requireAuth(req, res);
      if (!claims) return;
      req.user = claims;
    }
    if (isWrite && cfg.readOnly) return res.status(403).json({ error: "Read only" });
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
        const selectList = cfg.selectCols ? cfg.selectCols.map((c) => `\`${c}\``).join(",") : "*";
        if (req.query.id !== undefined) {
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
          const { skey, svalue } = req.body || {};
          if (!skey) return res.status(400).json({ error: "skey required" });
          await pool.query(
            "INSERT INTO site_settings (skey,svalue) VALUES (?,?) ON DUPLICATE KEY UPDATE svalue=VALUES(svalue)",
            [skey, svalue],
          );
          return res.json({ ok: true });
        }
        const payload = req.body || {};
        const cols = cfg.cols.filter((c) => payload[c] !== undefined);
        if (!cols.length) return res.status(400).json({ error: "No fields" });
        const vals = cols.map((c) => payload[c]);
        const sql = `INSERT INTO \`${table}\` (${cols.map((c) => "`" + c + "`").join(",")}) VALUES (${cols
          .map(() => "?")
          .join(",")})`;
        const [r] = await pool.query(sql, vals);
        return res.status(201).json({ id: r.insertId });
      }
      if (req.method === "PUT") {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: "id required" });
        if (entity === "site_settings") {
          const { svalue } = req.body || {};
          await pool.query("UPDATE site_settings SET svalue=? WHERE skey=?", [svalue, id]);
          return res.json({ ok: true });
        }
        const payload = req.body || {};
        const provided = cfg.cols.filter((c) => payload[c] !== undefined);
        if (!provided.length) return res.status(400).json({ error: "No fields" });
        const sets = provided.map((c) => "`" + c + "`=?");
        const vals = provided.map((c) => payload[c]);
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
      logger.error(`[${entity}] ${req.method} failed:`, e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // contact public
  app.post(
    "/api/contact",
    rateLimit({ limit: 10, message: "Too many messages, please try again later" }),
    async (req, res) => {
      const { full_name, phone, email, category, district, subject, message } = req.body || {};
      if (!full_name || !email || !subject || !message)
        return res.status(400).json({ error: "Missing required fields" });
      try {
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
      } catch (error) {
        logger.error("contact insert failed:", error.message);
        res.status(500).json({ error: "Unable to save the message" });
      }
    },
  );

  // dashboard
  app.get("/api/stats/dashboard", auth, async (req, res) => {
    try {
      const [[n]] = await pool.query("SELECT COUNT(*) c FROM news");
      const [[no]] = await pool.query("SELECT COUNT(*) c FROM notices");
      const [[ev]] = await pool.query("SELECT COUNT(*) c FROM events");
      const [[mn]] = await pool.query("SELECT COUNT(*) c FROM contact_messages WHERE status='new'");
      const [[mt]] = await pool.query("SELECT COUNT(*) c FROM contact_messages");
      const [[di]] = await pool.query("SELECT COUNT(*) c FROM districts");
      const [[sc]] = await pool.query("SELECT COUNT(*) c FROM schools");
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
          schools: sc.c,
          recent_messages: recent,
        },
      });
    } catch (error) {
      logger.error("dashboard failed:", error.message);
      res.status(500).json({ error: "Unable to load dashboard totals" });
    }
  });

  // upload
  // multer signals rejected files through errors; answer with a clean 400.
  app.post("/api/upload", auth, (req, res) => {
    upload.single("file")(req, res, (err) => {
      if (err)
        return res.status(400).json({ error: err.message || "Upload rejected", code: err.code });
      if (!req.file) return res.status(400).json({ error: "No file" });
      // Relative URL: hardcoding localhost leaked the internal host and broke
      // every deployed environment.
      const rel = `/uploads/${req.file.filename}`;
      res.json({ ok: true, url: rel, filename: req.file.filename, path: rel });
    });
  });

  // legacy PHP-style paths the browser client still uses
  alias(app, "/api/entities.php", "/api/entities");
  alias(app, "/entities.php", "/api/entities");
  alias(app, "/api/contact.php", "/api/contact");
  alias(app, "/contact.php", "/api/contact");
  alias(app, "/api/stats/dashboard.php", "/api/stats/dashboard");
  alias(app, "/stats/dashboard.php", "/api/stats/dashboard");
  alias(app, "/api/upload.php", "/api/upload");
  alias(app, "/upload.php", "/api/upload");
  alias(app, "/api/auth/login.php", "/api/auth/login");
  alias(app, "/auth/login.php", "/api/auth/login");
  alias(app, "/api/auth/change-password.php", "/api/auth/change-password");
  alias(app, "/auth/change-password.php", "/api/auth/change-password");
  alias(app, "/api/auth/me.php", "/api/auth/me");
  alias(app, "/auth/me.php", "/api/auth/me");
  alias(app, "/api/health.php", "/api/health");
  alias(app, "/api/whatsapp/subscribe.php", "/api/whatsapp/subscribe");

  app.use((req, res) => res.status(404).json({ error: "Not found" }));

  return app;
}
