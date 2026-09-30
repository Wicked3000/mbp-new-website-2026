import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { fail, ok, readJson } from "@server/http";
import { rateLimit } from "@server/rate-limit";
import {
  findUser,
  publicUserOf,
  tokenFor,
  TOKEN_COOKIE,
  sessionCookieOptions,
} from "@server/auth";

/**
 * POST /api/auth/login
 *
 * Ported from server/app.js:527-561. The behavioural change is where the token
 * goes: the Express version returned it in the JSON body and the browser stashed
 * it in localStorage. It is now set as an httpOnly cookie, so script running in
 * the page cannot read the admin session out of storage.
 *
 * That is the whole point of the change, and it has one consequence to be aware
 * of: the token is no longer visible to client JavaScript, so `api.isAuthed()`
 * in src/lib/api.ts can no longer answer synchronously. Admin gating moved to
 * app/admin/(protected)/layout.tsx, which checks the cookie server-side.
 */

// Runs on every request. `nodejs` is the default, but the JWT and bcrypt work
// here needs it stated: the Edge runtime has neither `jsonwebtoken` nor
// `node:crypto` in the form this code uses, and the runtime error only appears
// at request time rather than at build time.
export const runtime = "nodejs";

// Nothing here reads a request body, a cookie or the database at module scope,
// so the response can be cached as a build artefact. Login must never be.
export const dynamic = "force-dynamic";

type LoginBody = { username?: string; password?: string };

export async function POST(request: Request) {
  const limited = rateLimit(request, {
    limit: 10,
    message: "Too many login attempts, please try again later",
  });
  if (limited) return limited;

  const parsed = await readJson<LoginBody>(request);
  if (!parsed.ok) return parsed.response;

  const { username, password } = parsed.value;
  if (!username || !password) return fail(400, "Username and password required");

  let user;
  try {
    user = await findUser("username=? OR email=?", [username, username]);
  } catch (error) {
    console.error("login lookup failed:", (error as Error).message);
    return fail(500, "Unable to sign in right now");
  }

  // Async compare keeps a flood of guesses from blocking the event loop, and the
  // placeholder hash keeps the timing similar for unknown usernames. An empty
  // password_hash is the seeded "locked account" state, not a blank password.
  const hash =
    user?.password_hash || "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
  const okPassword = await bcrypt.compare(String(password), hash);

  if (!user || !okPassword) {
    // The seeded account ships without a password; say so instead of leaving the
    // operator staring at a generic rejection.
    if (user && !user.password_hash) {
      return fail(
        401,
        process.env.NODE_ENV === "production"
          ? "Invalid credentials"
          : `This account has no password yet. Run: npm run admin:password -- ${user.username} 'a long unique passphrase'`,
      );
    }
    return fail(401, "Invalid credentials");
  }

  const token = tokenFor(user);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, sessionCookieOptions());

  // The token is deliberately absent from the body. Returning it would put it
  // back in reach of any script on the page, which is what the cookie avoids.
  return ok({ user: publicUserOf(user) });
}
