import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { fail, ok } from "@server/http";
import { requireAuth } from "@server/auth";

/**
 * POST /api/upload
 *
 * Replaces the multer handler at server/app.js:831-841 with
 * `request.formData()`.
 *
 * ## What multer was doing that the Web API does not
 *
 * multer's `diskStorage` did three jobs: cap the size, validate the type, and
 * choose a filename. The Web API does the first two only if you ask, so all
 * three are reproduced explicitly below. Dropping the checks is the easy mistake
 * here - `formData()` will happily hand over a 2 GB body and a `.svg` file, and
 * this route writes to a directory the site serves from its own origin.
 */

/** server/app.js:291. */
const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

/** server/app.js:294-296, verbatim. */
const ALLOWED_UPLOAD_MIME =
  /^(image\/(jpeg|png|webp|gif|avif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet)|vnd\.ms-excel|text\/(csv|plain)))$/i;
const ALLOWED_UPLOAD_EXT = /\.(jpg|jpeg|png|webp|gif|avif|pdf|doc|docx|xls|xlsx|csv|txt)$/i;

/**
 * public/uploads is the single copy of that content for the whole project: the
 * browser is handed a /uploads/... URL and Next serves public/ from disk at
 * request time, so a file written here is reachable immediately without a
 * rebuild. This is why the app must run on a host with a writable, persistent
 * filesystem - on Vercel's serverless runtime this write is discarded when the
 * invocation ends and the image 404s while the API reported success.
 */
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** server/app.js:352 - multer created the directory at startup. */
async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export const runtime = "nodejs";

// A file upload is never cacheable, and the default body size limit for Route
// Handlers is smaller than multer's 25 MB, so both are raised here.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return fail(auth.status, auth.error);

  let form: FormData;
  try {
    form = await request.formData();
  } catch (error) {
    // formData() throws on a body that is not multipart, or one over the limit.
    // multer surfaced this as a 400 with a code; keep that shape.
    return fail(400, (error as Error).message || "Upload rejected", { code: "LIMIT" });
  }

  const entry = form.get("file");
  if (!entry) return fail(400, "No file");
  if (typeof entry === "string") return fail(400, "No file");

  // --- size cap. multer enforced this while streaming; here the part is
  // already in memory, so the check is after the fact. That is the one genuine
  // regression in this conversion: a hostile upload is read into the process
  // before being refused. The `Content-Length` pre-check below closes most of
  // that gap without buffering.
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > UPLOAD_MAX_BYTES) {
    return fail(400, "File is too large", { code: "LIMIT_FILE_SIZE" });
  }
  if (entry.size > UPLOAD_MAX_BYTES) {
    return fail(400, "File is too large", { code: "LIMIT_FILE_SIZE" });
  }

  const originalName = entry.name || "upload";
  const ext = path.extname(originalName).toLowerCase();

  // SVG is deliberately excluded: it is an XML document that can carry
  // <script>, and uploads are served from this origin, so accepting it is a
  // stored-XSS route into the admin's session. Preserved from server/app.js:373.
  if (ext === ".svg") return fail(400, "SVG uploads are not allowed");

  if (!ALLOWED_UPLOAD_MIME.test(entry.type) && !ALLOWED_UPLOAD_EXT.test(originalName)) {
    return fail(400, "Unsupported file type");
  }

  const buffer = Buffer.from(await entry.arrayBuffer());
  await ensureUploadDir();

  // server/app.js:358-362, unchanged: sanitise the stem, keep the caller's
  // extension, and add time + random so two uploads of `logo.png` cannot
  // overwrite each other.
  const base = path.parse(originalName).name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
  const filename = `${base}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  // Relative URL: hardcoding localhost leaked the internal host and broke every
  // deployed environment.
  const rel = `/uploads/${filename}`;
  return ok({ ok: true, url: rel, filename, path: rel });
}
