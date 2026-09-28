import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { createApp, DEFAULT_ORIGINS } from "./app.js";

dotenv.config();

const PORT = process.env.API_PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Fail closed: a published default signing key lets anyone mint admin tokens.
if (IS_PRODUCTION && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set when NODE_ENV=production");
}
const JWT_SECRET = process.env.JWT_SECRET || "mbp_education_dev_secret_change_me_32chars";
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

// Schema self-healing for installs that predate a column. Each helper is
// idempotent and never fatal: the API still serves whatever the DB already has.
async function addColumnIfMissing(table, column, definition) {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND column_name = ?",
      [DB.database, table, column],
    );
    if (Number(rows[0]?.count) === 0) {
      await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN ${column} ${definition}`);
      console.log(`[schema] added ${table}.${column}`);
    }
  } catch (error) {
    console.error(`Unable to ensure ${table}.${column}:`, error.message);
  }
}

async function ensureTable(sql) {
  try {
    await pool.query(sql);
  } catch (error) {
    console.error("Unable to ensure table:", error.message);
  }
}

// Bumped on every password change so tokens issued before it stop verifying.
const ensureAuthVersionColumn = () =>
  addColumnIfMissing("users", "auth_version", "INT NOT NULL DEFAULT 1");

const ensurePartnerLogoColumn = () => addColumnIfMissing("partners", "logo", "TEXT DEFAULT NULL");

const ensureSelectionGrade11Columns = async () => {
  for (const column of ["capacity", "placed", "cutoff"]) {
    await addColumnIfMissing("selections_grade11", column, "INT NULL");
  }
};

const ensureWhatsAppSubscribersTable = () =>
  ensureTable(`CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(20) NOT NULL UNIQUE,
      source VARCHAR(120) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

const ensureSelectionStudentsTable = () =>
  ensureTable(`CREATE TABLE IF NOT EXISTS selection_students (
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

const app = createApp({
  pool,
  jwtSecret: JWT_SECRET,
  allowedOrigins: (process.env.CORS_ORIGINS || DEFAULT_ORIGINS.join(","))
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  isProduction: IS_PRODUCTION,
  dbName: DB.database,
});

Promise.all([
  ensureAuthVersionColumn(),
  ensurePartnerLogoColumn(),
  ensureWhatsAppSubscribersTable(),
  ensureSelectionStudentsTable(),
  ensureSelectionGrade11Columns(),
  addColumnIfMissing("downloads", "program", "VARCHAR(40) NOT NULL DEFAULT '' AFTER file_path"),
  addColumnIfMissing("downloads", "sort_order", "INT NOT NULL DEFAULT 0"),
  // Tables backing the admin-managed page sections. The seed content lives in
  // the matching *_seed.sql files, which are applied separately.
  ensureTable("CREATE TABLE IF NOT EXISTS basic_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_overview_cards_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_overview_features_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0B2545]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_overview_stats_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_curriculum (id INT AUTO_INCREMENT PRIMARY KEY, area VARCHAR(160) NOT NULL DEFAULT '', grades VARCHAR(40) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_curriculum_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_initiatives_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_support_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_faq_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS basic_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_overview_cards_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_overview_features_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#163663]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_overview_stats_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_streams (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(160) NOT NULL DEFAULT '', grades VARCHAR(40) NOT NULL DEFAULT '', subjects TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_streams_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_assessment (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', bullet TEXT, sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_pathways (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500', stats VARCHAR(120) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_pathways_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-amber-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_initiatives_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_support_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_faq_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS post_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_overview_cards_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_overview_features_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0D9488]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_overview_stats_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_programs (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(40) NOT NULL DEFAULT '', name VARCHAR(200) NOT NULL DEFAULT '', duration VARCHAR(60) NOT NULL DEFAULT '', level VARCHAR(40) NOT NULL DEFAULT '', trades TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-amber-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_programs_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_centres (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', district VARCHAR(120) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT 'Operational', programs TEXT, capacity VARCHAR(40) NOT NULL DEFAULT '', facilities TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_centres_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_centre_names (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_centre_names_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_partners (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', sector VARCHAR(160) NOT NULL DEFAULT '', programs TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_partners_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_apprenticeship (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, bullet TEXT, sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_initiatives_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_enrolment_steps (id INT AUTO_INCREMENT PRIMARY KEY, step VARCHAR(8) NOT NULL DEFAULT '', title VARCHAR(200) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_enrolment_steps_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_intake_dates (id INT AUTO_INCREMENT PRIMARY KEY, label VARCHAR(200) NOT NULL DEFAULT '', date_text VARCHAR(80) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_intake_dates_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_support_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_faq_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS vet_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_overview_cards_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_overview_features_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0B2545]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_overview_stats_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_programs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', level VARCHAR(80) NOT NULL DEFAULT '', duration VARCHAR(60) NOT NULL DEFAULT '', subjects TEXT, target VARCHAR(255) NOT NULL DEFAULT '', icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_programs_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_centres (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', district VARCHAR(120) NOT NULL DEFAULT '', centre_type VARCHAR(60) NOT NULL DEFAULT 'Main Centre', students VARCHAR(40) NOT NULL DEFAULT '', facilities TEXT, coordinator VARCHAR(160) NOT NULL DEFAULT '', icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_centres_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_delivery_methods (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', availability VARCHAR(120) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_delivery_methods_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_app_callout (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, bullet TEXT, sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_enrolment_steps (id INT AUTO_INCREMENT PRIMARY KEY, step VARCHAR(8) NOT NULL DEFAULT '', title VARCHAR(200) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_enrolment_steps_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_key_dates (id INT AUTO_INCREMENT PRIMARY KEY, label VARCHAR(200) NOT NULL DEFAULT '', date_text VARCHAR(120) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_key_dates_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_support_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', whatsapp_label VARCHAR(160) NOT NULL DEFAULT '', whatsapp_value VARCHAR(120) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_initiatives_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_faq_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS fode_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS home_mission (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', heading_accent VARCHAR(255) NOT NULL DEFAULT '', para1 TEXT, para2 TEXT, image VARCHAR(255) DEFAULT NULL, image_alt VARCHAR(255) NOT NULL DEFAULT '', badge_value VARCHAR(40) NOT NULL DEFAULT '', badge_label VARCHAR(160) NOT NULL DEFAULT '', badge_sub VARCHAR(190) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/about', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS home_mission_points (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_home_mission_points_order (sort_order)) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS home_selection_banner (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', badge VARCHAR(40) NOT NULL DEFAULT '', body TEXT, primary_label VARCHAR(120) NOT NULL DEFAULT '', primary_href VARCHAR(255) NOT NULL DEFAULT '/selections', secondary_label VARCHAR(120) NOT NULL DEFAULT '', secondary_href VARCHAR(255) NOT NULL DEFAULT '/downloads', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS home_cta (id INT AUTO_INCREMENT PRIMARY KEY, badge VARCHAR(60) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, sub_body TEXT, image VARCHAR(255) DEFAULT NULL, image_alt VARCHAR(255) NOT NULL DEFAULT '', tagline VARCHAR(160) NOT NULL DEFAULT '', form_title VARCHAR(200) NOT NULL DEFAULT '', form_body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_placeholder VARCHAR(60) NOT NULL DEFAULT '', channel_label VARCHAR(160) NOT NULL DEFAULT '', channel_prompt VARCHAR(120) NOT NULL DEFAULT '', button_label VARCHAR(160) NOT NULL DEFAULT '', button_loading_label VARCHAR(160) NOT NULL DEFAULT '', response_note VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0) ENGINE=InnoDB"),
  ensureTable("CREATE TABLE IF NOT EXISTS home_cta_channels (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_home_cta_channels_order (sort_order)) ENGINE=InnoDB"),
]).finally(() => {
  app.listen(PORT, () =>
    console.log(
      `MBP API (Node) running on http://localhost:${PORT} - DB ${DB.host}:${DB.port}/${DB.database}`,
    ),
  );
});
