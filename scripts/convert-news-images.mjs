// Converts the news rows that hold inline base64 images into real files under
// public/uploads, then points the database at the new path.
//
// The rows were written by pasting images rather than uploading them, which put
// megabytes of base64 into the database, into the JS bundle, and past the
// browser's localStorage quota. Recovering the bytes is lossless: the data URL
// is decoded and written out as the same image.
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config();
const UPLOAD_DIR = "public/uploads";
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  charset: "utf8mb4",
});

const EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
const slug = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

const [rows] = await pool.query(
  "SELECT id, title, img FROM news WHERE img LIKE 'data:%'",
);
if (!rows.length) {
  console.log("No inline base64 images in news - nothing to convert.");
} else {
  for (const row of rows) {
    const m = /^data:([^;]+);base64,(.*)$/s.exec(row.img);
    if (!m) {
      console.log(`  id=${row.id}: not a base64 data URL, left alone`);
      continue;
    }
    const [, mime, b64] = m;
    const ext = EXT[mime];
    if (!ext) {
      console.log(`  id=${row.id}: unsupported type ${mime}, left alone`);
      continue;
    }
    const buffer = Buffer.from(b64, "base64");
    const name = `news-${slug(row.title)}_${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);

    // Magic-byte check: a decode that produced text or HTML would mean the
    // payload was not actually an image.
    const magic = buffer.subarray(0, 4);
    const isJpeg = magic[0] === 0xff && magic[1] === 0xd8;
    const isPng = magic.subarray(1, 4).toString() === "PNG";
    const looksRight =
      (ext === "jpg" && isJpeg) || (ext === "png" && isPng) || (ext === "webp" || ext === "gif");
    if (!looksRight) {
      console.log(`  id=${row.id}: DECODED DATA IS NOT A ${mime} IMAGE - not writing`);
      continue;
    }

    const rel = `/uploads/${name}`;
    await pool.query("UPDATE news SET img = ? WHERE id = ?", [rel, row.id]);
    console.log(`  id=${row.id} ${(buffer.length / 1024).toFixed(0)} KB -> ${rel}`);
  }
}

const [left] = await pool.query("SELECT COUNT(*) c FROM news WHERE img LIKE 'data:%'");
console.log(`news rows still holding base64: ${left[0].c}`);
const [nowRows] = await pool.query("SELECT id, title, img FROM news ORDER BY id");
for (const r of nowRows) console.log(`  ${r.id}  ${r.img}  ${r.title}`);

await pool.end();
