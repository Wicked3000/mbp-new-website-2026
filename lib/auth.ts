import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { query } from "./db";
import type { RowDataPacket } from "mysql2";

export const MIN_PASSWORD_LENGTH = 12;
export const TOKEN_COOKIE = "mbp_admin_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1d, matching the Express sign() call

export type PublicUser = {
  id: number;
  username: string;
  email: string;
  role: string;
};

type Claims = PublicUser & { uid: number; ver?: number };

/**
 * Fail closed: a published default signing key lets anyone mint an admin token.
 * The Express server threw at startup (server/index.js:11-13); here it throws on
 * first use, because there is no startup.
 */
function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set when NODE_ENV=production");
  }
  console.warn(
    "[security] JWT_SECRET is unset - using the public development default. Never do this in production.",
  );
  return "mbp_education_dev_secret_change_me_32chars";
}

export function signToken(user: PublicUser & { auth_version?: number }): string {
  const ver = user.auth_version === undefined ? undefined : Number(user.auth_version);
  return jwt.sign({ uid: user.id, ...user, ...(ver ? { ver } : {}) }, jwtSecret(), {
    expiresIn: TOKEN_TTL_SECONDS,
  });
}

function verifyToken(token: string): Claims {
  return jwt.verify(token, jwtSecret()) as Claims;
}

type UserRow = RowDataPacket &
  PublicUser & { password_hash: string; auth_version?: number };

const USER_COLUMNS = "id, username, email, role, password_hash";

/**
 * users.auth_version is what makes a password change revoke live tokens. It is
 * added by `npm run db:ensure`, but a database the app cannot ALTER (shared
 * hosting) must still log in, so probe once and remember the answer - ported
 * from server/app.js:441-455.
 */
let authVersionColumn: boolean | null = null;
export async function hasAuthVersionColumn(): Promise<boolean> {
  if (authVersionColumn !== null) return authVersionColumn;
  try {
    await query("SELECT auth_version FROM users LIMIT 1");
    authVersionColumn = true;
  } catch (error) {
    authVersionColumn = false;
    console.warn(
      "[security] users.auth_version is unavailable, so password changes cannot revoke existing tokens:",
      (error as Error).message,
    );
  }
  return authVersionColumn;
}

export async function findUser(where: string, params: unknown[]): Promise<UserRow | undefined> {
  const versioned = await hasAuthVersionColumn();
  const rows = await query<UserRow>(
    `SELECT ${USER_COLUMNS}${versioned ? ", auth_version" : ""} FROM users WHERE ${where} LIMIT 1`,
    params,
  );
  return rows[0];
}

export function publicUserOf(user: {
  id: number;
  username: string;
  email: string;
  role: string;
}): PublicUser {
  return { id: user.id, username: user.username, email: user.email, role: user.role };
}

export function tokenFor(user: PublicUser & { auth_version?: number }): string {
  return signToken(user);
}

/**
 * Reads the bearer token from either place.
 *
 * The `Authorization` header branch is kept from the Express version so
 * `curl` and any script still work. The cookie is the primary path: it is what
 * makes the admin session unreadable from JavaScript, which is the entire point
 * of moving off localStorage.
 */
function readToken(headers: Headers, cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  const header = headers.get("authorization") || headers.get("x-authorization") || "";
  const match = header.match(/Bearer\s+(.+)/);
  if (match) return match[1].trim();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

export type AuthResult =
  | { ok: true; claims: Claims }
  | { ok: false; status: 401 | 503; error: string };

/**
 * The actual verification, shared by both entry points below.
 *
 * Two things changed from the Express middleware and both matter:
 *
 * 1. The token comes from an httpOnly cookie. A Server Component, a Route
 *    Handler and `curl` all see it; browser JavaScript does not, so an XSS in
 *    the admin cannot read the token out of storage the way `localStorage`
 *    allowed.
 *
 * 2. This still hits the database on every call, because `auth_version` is what
 *    retires tokens after a password change, and that check cannot move to
 *    `middleware.ts` (no DB access there, and `jsonwebtoken` does not run on the
 *    Edge runtime). The cost is the same one-query round trip per request that
 *    the Express version already paid. A `cache()`-wrapped variant would be
 *    wrong: a revoked token would stay valid for the cache window.
 */
async function verify(raw: string | null): Promise<AuthResult> {
  if (!raw) return { ok: false, status: 401, error: "Missing token" };

  let claims: Claims;
  try {
    claims = verifyToken(raw);
  } catch {
    return { ok: false, status: 401, error: "Invalid or expired token" };
  }

  if (claims.ver !== undefined && (await hasAuthVersionColumn())) {
    try {
      const rows = await query<RowDataPacket & { auth_version: number | null }>(
        "SELECT auth_version FROM users WHERE id=? LIMIT 1",
        [claims.uid],
      );
      if (Number(rows[0]?.auth_version ?? 1) !== Number(claims.ver)) {
        return { ok: false, status: 401, error: "Session revoked, please sign in again" };
      }
    } catch (error) {
      // Fail closed: without this check a revoked admin token stays usable.
      console.error("Unable to verify token version:", (error as Error).message);
      return { ok: false, status: 503, error: "Session verification unavailable" };
    }
  }

  return { ok: true, claims };
}

/**
 * For Route Handlers. Accepts the cookie or an `Authorization: Bearer` header,
 * the latter so `curl` and deploy scripts keep working.
 */
export async function requireAuth(request: Request): Promise<AuthResult> {
  const cookieStore = await cookies();
  return verify(readToken(request.headers, cookieStore));
}

/**
 * For Server Components - the admin layout's gate.
 *
 * Cookie only, with no `Request` to read headers from. Kept separate from
 * `requireAuth` rather than passing a synthetic empty Request, because that
 * would be a lie about what the function does: there is no request here, and
 * pretending otherwise invites someone to later rely on the header branch
 * working in a layout, where it cannot.
 */
export async function requireSession(): Promise<AuthResult> {
  const cookieStore = await cookies();
  return verify(cookieStore.get(TOKEN_COOKIE)?.value ?? null);
}

/**
 * Session cookie options.
 *
 * `httpOnly` is the security property. `sameSite: "lax"` is required, not
 * preferred: with `strict`, an admin who follows a link in from an email is
 * signed out on arrival. `secure` is omitted in development because a secure
 * cookie is silently dropped over plain http on localhost.
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  };
}
