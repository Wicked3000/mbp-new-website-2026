// Imports a .sql file over the mysql2 connection rather than shelling out to
// mysql.exe. Piping through the Windows console mangles UTF-8 (emoji and en
// dashes arrive as mojibake), so the import has to stay inside Node.
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/import-sql.mjs <file.sql>");
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  charset: "utf8mb4",
  multipleStatements: true,
});

// A UTF-8 BOM is not valid SQL and makes the first statement fail to parse.
const sql = fs.readFileSync(path.resolve(file), "utf8").replace(/^﻿/, "");
try {
  await pool.query(sql);
  console.log(`Imported ${path.basename(file)}`);
} catch (error) {
  console.error("Import failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
