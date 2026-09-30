import { execute } from "@server/db";
import { fail, ok, readJson } from "@server/http";
import { rateLimit } from "@server/rate-limit";

/**
 * POST /api/contact
 *
 * Ported from server/app.js:770-796.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  full_name?: string;
  phone?: string;
  email?: string;
  category?: string;
  district?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  const limited = rateLimit(request, {
    limit: 10,
    message: "Too many messages, please try again later",
  });
  if (limited) return limited;

  const parsed = await readJson<Body>(request);
  if (!parsed.ok) return parsed.response;
  const { full_name, phone, email, category, district, subject, message } = parsed.value;

  if (!full_name || !email || !subject || !message) {
    return fail(400, "Missing required fields");
  }

  try {
    await execute(
      "INSERT INTO contact_messages (full_name,phone,email,category,district,subject,message) VALUES (?,?,?,?,?,?,?)",
      [
        full_name,
        phone || "",
        email,
        category || "General Enquiry",
        district || "",
        subject,
        message,
      ],
    );
    return ok({ ok: true });
  } catch (error) {
    console.error("contact insert failed:", (error as Error).message);
    return fail(500, "Unable to save the message");
  }
}
