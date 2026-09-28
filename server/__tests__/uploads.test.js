// The API and the site must agree on where an uploaded file lives.
//
// The API hands the browser a /uploads/... URL. That path is served
// statically from public/ - by Vite in development, and from dist/ in a build -
// and there is deliberately no Vite proxy for it, so a file written anywhere
// other than public/uploads is stored somewhere the site never reads. The
// symptom is nasty because the API reports success: the admin sees "uploaded",
// and the image 404s.
//
// This fails if the upload directory moves away from public/, and if a file
// accumulates in the old location, which is how the first occurrence went
// unnoticed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { UPLOAD_DIR } from "../app.js";

const root = path.resolve(import.meta.dirname, "..", "..");
const served = path.join(root, "public", "uploads");
const legacy = path.join(root, "server", "uploads");

describe("upload location", () => {
  it("writes into public/uploads, the directory the site serves", () => {
    expect(path.resolve(UPLOAD_DIR)).toBe(path.resolve(served));
  });

  it("is inside public/, so uploads are committed and deployed", () => {
    // public/ is the single copy that reaches production. Writing outside it
    // means an upload needs a second copy step before it can go live.
    expect(path.resolve(UPLOAD_DIR).startsWith(path.resolve(path.join(root, "public")))).toBe(
      true,
    );
  });

  it("has left nothing behind in the old server/uploads directory", () => {
    // Files here are unreachable by the browser. Recover them into public/ rather
    // than committing them.
    const strays = fs.existsSync(legacy)
      ? fs.readdirSync(legacy).filter((f) => f !== ".gitkeep")
      : [];
    expect(strays, `move these into public/uploads: ${strays.join(", ")}`).toEqual([]);
  });

  it("serves existing uploads from that same directory", () => {
    expect(fs.existsSync(served)).toBe(true);
    expect(fs.readdirSync(served).length).toBeGreaterThan(0);
  });
});
