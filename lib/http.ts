import { NextResponse } from "next/server";

/**
 * Response helpers.
 *
 * The Express handlers used `res.status(n).json({ error })` everywhere, and
 * `src/lib/api.ts` reads `j.error` and `j.details` (lines 21-26). These
 * wrappers keep that exact wire format so the browser client needs no change
 * beyond its base URL and credentials mode.
 */

export function ok(data: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

export function created(data: unknown): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function fail(status: number, error: string, extra?: Record<string, unknown>): NextResponse {
  return NextResponse.json({ error, ...extra }, { status });
}

/**
 * Parses a JSON body without letting a malformed payload throw an unhandled
 * rejection.
 *
 * `express.json({ limit: "25mb" })` produced a clean 400 through Express's
 * error handler. `request.json()` in a Route Handler throws a raw
 * `SyntaxError` instead, which Next turns into an HTML error page - the admin
 * would see "Unexpected token < in JSON" with no status the client can branch
 * on.
 */
export async function readJson<T = Record<string, unknown>>(
  request: Request,
): Promise<{ ok: true; value: T } | { ok: false; response: NextResponse }> {
  try {
    return { ok: true, value: (await request.json()) as T };
  } catch {
    return { ok: false, response: fail(400, "Invalid JSON body") };
  }
}
