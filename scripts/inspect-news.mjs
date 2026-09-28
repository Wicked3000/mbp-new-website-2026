import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  charset: "utf8mb4",
});
const [rows] = await pool.query(
  "SELECT id, title, LENGTH(img) img_len, LEFT(img, 60) img_head FROM news ORDER BY LENGTH(img) DESC",
);
for (const r of rows) {
  console.log(`id=${r.id}  img=${(r.img_len / 1024).toFixed(1)} KB  head=${JSON.stringify(r.img_head)}`);
  console.log(`      title=${r.title}`);
}
await pool.end();
