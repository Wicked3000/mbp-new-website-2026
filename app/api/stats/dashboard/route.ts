import { count, query } from "@server/db";
import { fail, ok } from "@server/http";
import { requireAuth } from "@server/auth";

/**
 * GET /api/stats/dashboard
 *
 * Ported from server/app.js:799-827. The eight sequential COUNT queries are
 * kept as-is rather than folded into one: the original shape is easy to read
 * against the dashboard panel, and eight counts over indexed tables is not the
 * bottleneck. If this ever shows up in a profile, the fix is a single
 * sub-select per table, not a rewrite of the handler.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return fail(auth.status, auth.error);

  try {
    const [news, notices, events, messagesNew, messagesTotal, districts, schools] =
      await Promise.all([
        count("news"),
        count("notices"),
        count("events"),
        count("contact_messages", "WHERE status='new'"),
        count("contact_messages"),
        count("districts"),
        count("schools"),
      ]);

    const recent = await query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5",
    );

    return ok({
      data: {
        news,
        notices,
        events,
        messages_new: messagesNew,
        messages_total: messagesTotal,
        districts,
        schools,
        recent_messages: recent,
      },
    });
  } catch (error) {
    console.error("dashboard failed:", (error as Error).message);
    return fail(500, "Unable to load dashboard totals");
  }
}
