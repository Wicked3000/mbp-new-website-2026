// Set or reset an admin password. Run after importing the SQL, and whenever you
// need to rotate a credential without a working login:
//
//   npm run admin:password -- admin 'a long unique passphrase'
//
// The password is read from the argument or, preferably, the MBP_ADMIN_PASSWORD
// environment variable so it never lands in shell history.
import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const MIN_LENGTH = 12;
const [username, ...rest] = process.argv.slice(2);
const password = process.env.MBP_ADMIN_PASSWORD || rest.join(" ");

if (!username || !password) {
  console.error("Usage: npm run admin:password -- <username> <new password>");
  console.error("   or: MBP_ADMIN_PASSWORD='...' npm run admin:password -- <username>");
  process.exit(1);
}
if (password.length < MIN_LENGTH) {
  console.error(`Refusing to set a password shorter than ${MIN_LENGTH} characters.`);
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
});

const hash = await bcrypt.hash(password, 10);
try {
  const [result] = await pool.query(
    "UPDATE users SET password_hash=? WHERE username=? OR email=?",
    [hash, username, username],
  );
  if (!result.affectedRows) {
    console.error(
      `No user matched "${username}". Import backend/database/mbp_education.sql first.`,
    );
    process.exit(1);
  }
  // Retire any token issued from the old password.
  await pool.query("UPDATE users SET auth_version=auth_version+1 WHERE username=? OR email=?", [
    username,
    username,
  ]);
  console.log(`Password updated for "${username}". Every existing session has been signed out.`);
} finally {
  await pool.end();
}
