import { ok } from "@server/http";

/**
 * GET /api/health
 *
 * Ported from server/app.js:500-504. The Express version also answered
 * /health.php; that alias existed for the PHP-shaped browser client, which is
 * gone (see src/lib/api.ts, now that it calls /api/*).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return ok({
    status: "ok",
    db: process.env.DB_NAME || "mbp_education",
    time: new Date().toISOString(),
  });
}
