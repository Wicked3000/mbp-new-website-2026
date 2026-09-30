import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { execute } from "@server/db";
import { fail, ok, readJson } from "@server/http";
import {
  findUser,
  hasAuthVersionColumn,
  publicUserOf,
  requireAuth,
  tokenFor,
  TOKEN_COOKIE,
  sessionCookieOptions,
  MIN_PASSWORD_LENGTH,
} from "@server/auth";

/**
 * POST /api/auth/change-password
 *
 * Ported from server/app.js:567-601.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { current_password?: string; new_password?: string };

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return fail(auth.status, auth.error);

  const parsed = await readJson<Body>(request);
  if (!parsed.ok) return parsed.response;

  const current = String(parsed.value.current_password || "");
  const next = String(parsed.value.new_password || "");
  if (!current || !next) return fail(400, "Both passwords are required");
  if (next.length < MIN_PASSWORD_LENGTH) {
    return fail(400, `Use at least ${MIN_PASSWORD_LENGTH} characters for the new password`);
  }
  if (current === next) {
    return fail(400, "Choose a password you have not used here before");
  }

  try {
    const user = await findUser("id=?", [auth.claims.uid]);
    if (!user) return fail(404, "Account not found");
    if (!(await bcrypt.compare(current, user.password_hash || ""))) {
      return fail(401, "Current password is incorrect");
    }
    if (await bcrypt.compare(next, user.password_hash || "")) {
      return fail(400, "Choose a different password");
    }

    const versioned = await hasAuthVersionColumn();
    const hash = await bcrypt.hash(next, 10);
    await execute("UPDATE users SET password_hash=? WHERE id=?", [hash, user.id]);

    // Bumping the version retires every token minted from the old password.
    const version = Number(user.auth_version ?? 1) + 1;
    if (versioned) {
      await execute("UPDATE users SET auth_version=? WHERE id=?", [version, user.id]);
    }

    // Re-issue the session cookie so the admin stays signed in; every earlier
    // token is now dead.
    const token = tokenFor({ ...user, auth_version: versioned ? version : undefined });
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE, token, sessionCookieOptions());

    return ok({ ok: true, user: publicUserOf(user) });
  } catch (error) {
    console.error("change-password failed:", error);
    return fail(500, "Unable to update the password");
  }
}
