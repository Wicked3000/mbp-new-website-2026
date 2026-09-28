// Regenerates the entity map and public-read allowlist inside
// backend/api/entities.php from the Node API's server/app.js, so the two API
// clients cannot drift apart again. Run after adding an entity to ENTITY_MAP:
//
//   node scripts/sync-php-entities.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ENTITY_MAP, PUBLIC_READ } from "../server/app.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "backend", "api", "entities.php");
const php = fs.readFileSync(target, "utf8");

const q = (s) => `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
const entry = ([entity, cfg]) => {
  const parts = [
    `'table'=>${q(cfg.table)}`,
    `'cols'=>[${cfg.cols.map(q).join(",")}]`,
  ];
  if (cfg.pk) parts.push(`'pk'=>${q(cfg.pk)}`);
  if (cfg.selectCols) parts.push(`'selectCols'=>[${cfg.selectCols.map(q).join(",")}]`);
  if (cfg.readOnly) parts.push(`'readOnly'=>true`);
  return `  '${entity}'=>[${parts.join(",")}]`;
};

const map = [
  "$MAP=[",
  // Trailing commas: the generated rows are long, and PHP allows one after the
  // last element, so appending a row never needs an edit to the row above it.
  ...Object.entries(ENTITY_MAP).map((e) => entry(e) + ","),
  "];",
].join("\n");

const publicRead = [
  "$publicRead=[",
  ...[...PUBLIC_READ].map((e) => `  '${e}',`),
  "];",
].join("\n");

const next = php
  .replace(/\$MAP=\[[\s\S]*?\n\];/, map)
  .replace(/\$publicRead\s*=\s*\[[\s\S]*?\];/, publicRead);

if (next === php) {
  console.error("No $MAP or $publicRead block found in entities.php - nothing written.");
  process.exit(1);
}
fs.writeFileSync(target, next);
console.log(
  `entities.php now registers ${Object.keys(ENTITY_MAP).length} entities, ` +
    `${PUBLIC_READ.size} of them publicly readable.`,
);
