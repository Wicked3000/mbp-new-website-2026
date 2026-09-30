import { cookies } from "next/headers";
import { ok } from "@server/http";
import { requireAuth } from "@server/auth";

/**
 * GET /api/auth/me
 *
 * Ported from server/app.js:563. Used by the admin layout to confirm a session
 * and to render the username in the sidebar.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return ok({ user: null }, { status: auth.status });
  return ok({ user: auth.claims });
}
