import { execute } from "@server/db";
import { fail, ok, readJson } from "@server/http";
import { rateLimit } from "@server/rate-limit";

/**
 * POST /api/whatsapp/subscribe
 *
 * Ported from server/app.js:651-671.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { phone?: string; source?: string };

export async function POST(request: Request) {
  const limited = rateLimit(request, {
    limit: 20,
    message: "Too many subscriptions from this address",
  });
  if (limited) return limited;

  const parsed = await readJson<Body>(request);
  if (!parsed.ok) return parsed.response;

  const phone = String(parsed.value.phone || "").trim();
  const source = String(parsed.value.source || "Official announcements").trim();

  if (!/^\+?\d{7,15}$/.test(phone)) return fail(400, "Enter a valid WhatsApp number");
  if (!source) return fail(400, "Subscription channel required");

  try {
    await execute(
      "INSERT INTO whatsapp_subscribers (phone, source) VALUES (?, ?) ON DUPLICATE KEY UPDATE source = VALUES(source)",
      [phone, source],
    );
    return ok({ ok: true });
  } catch (error) {
    console.error("whatsapp subscribe failed:", (error as Error).message);
    return fail(500, "Unable to save subscription");
  }
}
