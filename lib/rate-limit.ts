import "server-only";
import { NextResponse } from "next/server";
import { fail } from "./http";

/**
 * Fixed-window rate limiter, ported from `createRateLimiter` in
 * server/app.js:300-329.
 *
 * In-memory on purpose, exactly as before: it is there to blunt credential
 * stuffing and contact-form spam, and it needs no dependency and no shared
 * state to do that job.
 *
 * Two differences worth knowing:
 *
 * - It lives in module scope, which in Next means per *worker process* rather
 *   than per server. Behind a load balancer with N instances, the effective
 *   limit is N x `limit`. The Express version had one process and so was exact.
 *   If this site ever runs multi-instance, this needs a real store (Redis, or
 *   the platform's rate-limit product) - the current code is honest about
 *   being best-effort, not correct at scale.
 *
 * - In development Next re-evaluates modules on hot reload, which empties the
 *   buckets. That is why the dev experience is more forgiving than production.
 *   Do not tune limits by testing them locally.
 */
const WINDOW_MS = 15 * 60 * 1000;

const globalForLimit = globalThis as unknown as { mbpRateBuckets?: Map<string, Bucket> };

type Bucket = { count: number; resetAt: number };

function buckets(): Map<string, Bucket> {
  globalForLimit.mbpRateBuckets ??= new Map();
  return globalForLimit.mbpRateBuckets;
}

// Reap expired buckets on an interval. unref() so the timer never holds the
// process open on shutdown, which the Express version also needed.
if (!globalForLimit.mbpRateBuckets) {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets()) {
      if (now > bucket.resetAt) buckets().delete(key);
    }
  }, WINDOW_MS);
  timer.unref?.();
}

/**
 * Client identity.
 *
 * The Express version used `req.ip`, which Express derives from
 * X-Forwarded-For when `trust proxy` is set (server/index.js:384) and from the
 * socket otherwise. Route Handlers get no socket, so the header is read
 * directly. Without TRUSTED_PROXY every request on a proxied deployment shares
 * one bucket, and one admin hammering the login page locks out the whole site -
 * the exact failure that comment was written to prevent.
 */
function clientKey(request: Request): string {
  if (process.env.TRUSTED_PROXY) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
  }
  return "local";
}

export type RateLimitOptions = {
  limit: number;
  windowMs?: number;
  message?: string;
  /** Defaults to the method and path, so each route gets its own budget. */
  scope?: string;
};

/**
 * Returns `null` when the request is allowed, or a ready 429 when it is not.
 *
 * Shaped as a null-returning check rather than Express middleware, because
 * Route Handlers have no middleware chain: every handler has to decide what to
 * do with the result, and a handler that forgets simply skips the limit. The
 * call sites are four lines and all of them read the same.
 */
export function rateLimit(
  request: Request,
  { limit, windowMs = WINDOW_MS, message, scope }: RateLimitOptions,
): NextResponse | null {
  const url = new URL(request.url);
  const key = `${request.method}:${scope ?? url.pathname}:${clientKey(request)}`;
  const now = Date.now();

  const store = buckets();
  let entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }
  entry.count += 1;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    const response = fail(429, message || "Too many requests, please try again later");
    response.headers.set("Retry-After", String(retryAfter));
    return response;
  }
  return null;
}
