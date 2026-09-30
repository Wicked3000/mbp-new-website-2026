import { cookies } from "next/headers";
import { ok } from "@server/http";
import { TOKEN_COOKIE } from "@server/auth";

/**
 * POST /api/auth/logout
 *
 * New. The Express version had no logout endpoint: the admin button called
 * `api.logout()`, which deleted two localStorage keys and left the JWT valid
 * until it expired. Anyone who had copied the token out of storage kept a
 * working credential for up to a day.
 *
 * With a cookie the browser can be made to forget it, so this clears the cookie
 * and the client no longer has to manage session state at all. The token itself
 * stays cryptographically valid until it expires - true server-side revocation
 * would mean an allowlist, which is not worth it for a single-admin site where
 * the password-change path already bumps auth_version and retires everything.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  return ok({ ok: true });
}
