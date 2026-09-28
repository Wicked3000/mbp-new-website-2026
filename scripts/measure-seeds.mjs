// Measures the offline seed payload against the browser localStorage quota.
import fs from "node:fs";
const src = fs.readFileSync("src/lib/api.ts", "utf8");
const start = src.indexOf("const SEEDS: Record<string, any[]> = ");
const end = src.indexOf("// END AUTO-GENERATED SEEDS");
const block = src.slice(start, end);
const json = block.slice(block.indexOf("=") + 1).replace(/;\s*$/, "").trim();
const parsed = JSON.parse(json);
const bytes = Buffer.byteLength(json, "utf8");
const per = Object.entries(parsed)
  .map(([k, v]) => [k, Buffer.byteLength(JSON.stringify(v), "utf8")])
  .sort((a, b) => b[1] - a[1]);
console.log(`total seed payload: ${(bytes / 1024 / 1024).toFixed(2)} MB (${bytes} bytes)`);
console.log(`browser localStorage quota: ~5.00 MB`);
console.log(`entities: ${per.length}\n`);
console.log("largest 12 entities:");
for (const [k, n] of per.slice(0, 12)) {
  console.log(`  ${k.padEnd(26)} ${(n / 1024).toFixed(1)} KB`);
}
console.log("\nLargest entity share of quota:");
console.log(`  ${((per[0][1] / bytes) * 100).toFixed(1)}%  (${per[0][0]})`);
