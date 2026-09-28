// Rotates the admin password off the published default.
//
// The login form used to prefill "password" and print "admin / password", and
// the stored hash still matched that pair. Only the login copy was removed in
// the previous commit; this changes the credential itself.
//
// Usage: node scripts/reset-admin-password.mjs <username> [password]
// With no password, a strong one is generated and printed once.
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();
const username = process.argv[2] || "admin";
const supplied = process.argv[3];

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  charset: "utf8mb4",
});

// Unambiguous alphabet: no O/0, l/1, I so it can be read aloud or copied off a
// screen without transposition mistakes.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
function generate(length = 20) {
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

const [users] = await pool.query("SELECT id, username FROM users WHERE username = ?", [username]);
if (!users.length) {
  console.error(`No user called "${username}".`);
  await pool.end();
  process.exit(1);
}

const password = supplied || generate();
if (password.length < 12) {
  console.error("Refusing a password shorter than 12 characters.");
  await pool.end();
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, users[0].id]);

// Prove the new credential works and the old default no longer does.
const ok = await bcrypt.compare(password, hash);
const old = await bcrypt.compare("password", hash);
console.log(`user:     ${username}`);
console.log(`new hash accepted: ${ok}`);
console.log(`"password" still works: ${old}`);
console.log(`\nNEW PASSWORD: ${password}`);
console.log("This is shown once. Store it in a password manager.");

await pool.end();
