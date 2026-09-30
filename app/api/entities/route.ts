import { execute, query } from "@server/db";
import { created, fail, ok, readJson } from "@server/http";
import { requireAuth } from "@server/auth";
import { ENTITY_MAP, PUBLIC_READ } from "@server/entities";

/**
 * /api/entities - the generic CRUD endpoint.
 *
 * Ported from `app.all("/api/entities")` at server/app.js:674-767. This one
 * handler backs all 81 entities, which is why it is worth reading carefully
 * rather than treating as boilerplate.
 *
 * ## The security model
 *
 * `entity` arrives from the query string and is used to pick a table, a column
 * list and a primary key, all of which are interpolated into SQL. The only thing
 * standing between the request and the database is the `Object.hasOwn` check
 * below, so it is not optional and it must not become `ENTITY_MAP[entity]`:
 * a plain property lookup happily resolves "constructor" and "__proto__", and
 * the code would then build a query against `undefined`.
 *
 * Column names come from `cfg.cols`, never from the request, so the SET and
 * INSERT clauses cannot be steered by the payload.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(request: Request, method: string): Promise<Response> {
  const url = new URL(request.url);
  const entity = url.searchParams.get("entity");
  const id = url.searchParams.get("id");

  if (!entity || !Object.hasOwn(ENTITY_MAP, entity)) {
    return fail(400, "Unknown entity", { allowed: Object.keys(ENTITY_MAP) });
  }

  const cfg = ENTITY_MAP[entity];
  const table = cfg.table;
  const pk = cfg.pk || "id";
  const isWrite = method !== "GET";

  // Public GETs are limited to the allowlist; every write needs a valid token.
  if (isWrite || !PUBLIC_READ.has(entity)) {
    const auth = await requireAuth(request);
    if (!auth.ok) return fail(auth.status, auth.error);
  }

  if (isWrite && cfg.readOnly) return fail(403, "Read only");

  try {
    if (method === "GET") return await handleGet(entity, cfg, table, pk, id);
    if (method === "POST") return await handlePost(entity, cfg, table, request);
    if (method === "PUT") return await handlePut(entity, cfg, table, pk, id, request);
    if (method === "DELETE") return await handleDelete(table, pk, id);
    return fail(405, "Method not allowed");
  } catch (error) {
    // Log the detail server-side; never hand SQL text or table names to callers.
    console.error(`[${entity}] ${method} failed:`, error);
    return fail(500, "DB error");
  }
}

async function handleGet(
  entity: string,
  cfg: (typeof ENTITY_MAP)[string],
  table: string,
  pk: string,
  id: string | null,
): Promise<Response> {
  if (entity === "site_settings") {
    const rows = await query<{ skey: string; svalue: string }>(
      "SELECT skey,svalue FROM site_settings",
    );
    const map: Record<string, string> = {};
    rows.forEach((row) => (map[row.skey] = row.svalue));
    return ok({ data: map });
  }

  // Entities with a selectCols allowlist (e.g. users) must never fall back to
  // SELECT *, which would hand back password_hash.
  const selectList = cfg.selectCols ? cfg.selectCols.map((c) => `\`${c}\``).join(",") : "*";

  if (id !== null) {
    const rows = await query(
      `SELECT ${selectList} FROM \`${table}\` WHERE \`${pk}\`=? LIMIT 1`,
      [id],
    );
    if (!rows[0]) return fail(404, "Not found");
    return ok({ data: rows[0] });
  }

  const rows = await query(`SELECT ${selectList} FROM \`${table}\` ORDER BY \`${pk}\` ASC`);
  return ok({ data: rows });
}

async function handlePost(
  entity: string,
  cfg: (typeof ENTITY_MAP)[string],
  table: string,
  request: Request,
): Promise<Response> {
  const parsed = await readJson<Record<string, unknown>>(request);
  if (!parsed.ok) return parsed.response;
  const payload = parsed.value;

  if (entity === "site_settings") {
    const { skey, svalue } = payload as { skey?: string; svalue?: string };
    if (!skey) return fail(400, "skey required");
    await execute(
      "INSERT INTO site_settings (skey,svalue) VALUES (?,?) ON DUPLICATE KEY UPDATE svalue=VALUES(svalue)",
      [skey, svalue],
    );
    return ok({ ok: true });
  }

  const cols = cfg.cols.filter((c) => payload[c] !== undefined);
  if (!cols.length) return fail(400, "No fields");

  const sql =
    `INSERT INTO \`${table}\` (${cols.map((c) => "`" + c + "`").join(",")}) ` +
    `VALUES (${cols.map(() => "?").join(",")})`;
  const result = await execute(
    sql,
    cols.map((c) => payload[c]),
  );
  return created({ id: result.insertId });
}

async function handlePut(
  entity: string,
  cfg: (typeof ENTITY_MAP)[string],
  table: string,
  pk: string,
  id: string | null,
  request: Request,
): Promise<Response> {
  if (!id) return fail(400, "id required");

  const parsed = await readJson<Record<string, unknown>>(request);
  if (!parsed.ok) return parsed.response;
  const payload = parsed.value;

  if (entity === "site_settings") {
    const { svalue } = payload as { svalue?: string };
    await execute("UPDATE site_settings SET svalue=? WHERE skey=?", [svalue, id]);
    return ok({ ok: true });
  }

  const provided = cfg.cols.filter((c) => payload[c] !== undefined);
  if (!provided.length) return fail(400, "No fields");

  const sets = provided.map((c) => "`" + c + "`=?");
  const result = await execute(
    `UPDATE \`${table}\` SET ${sets.join(",")} WHERE \`${pk}\`=?`,
    [...provided.map((c) => payload[c]), id],
  );
  return ok({ ok: true, affected: result.affectedRows });
}

async function handleDelete(table: string, pk: string, id: string | null): Promise<Response> {
  if (!id) return fail(400, "id required");
  await execute(`DELETE FROM \`${table}\` WHERE \`${pk}\`=?`, [id]);
  return ok({ ok: true });
}

export async function GET(request: Request) {
  return handle(request, "GET");
}

export async function POST(request: Request) {
  return handle(request, "POST");
}

export async function PUT(request: Request) {
  return handle(request, "PUT");
}

export async function DELETE(request: Request) {
  return handle(request, "DELETE");
}
