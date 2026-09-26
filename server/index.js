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
]).finally(() => {
  app.listen(PORT, () =>
    console.log(
      `MBP API (Node) running on http://localhost:${PORT} - DB ${DB.host}:${DB.port}/${DB.database}`,
    ),
  );
});
