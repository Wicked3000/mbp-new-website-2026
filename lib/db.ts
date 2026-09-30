import "server-only";
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";

/**
 * MySQL connection pool, one per process.
 *
 * ## Why the globalThis cache
 *
 * The Express server called `mysql.createPool()` exactly once, at the top of
 * `server/index.js`, and the process lived as long as the server did. The App
 * Router has no equivalent single entry point: route handlers are modules Next
 * loads on demand, and in development it re-evaluates them on every hot reload.
 *
 * Without the cache below, every reload opens a fresh pool of 10 connections
 * and the previous one is never closed. MySQL's `max_connections` default is
 * 151, so a handful of editor saves is enough to exhaust the server and take
 * the site down with ER_CON_COUNT_ERROR - a failure that looks nothing like its
 * cause and reappears on every save.
 *
 * `globalThis` is the one object that survives module re-evaluation, so the pool
 * is stashed there and reused. This is the same pattern Prisma, Drizzle and
 * Next's own database examples use.
 */
const globalForDb = globalThis as unknown as { mbpPool?: Pool };

export const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
};

function createPool(): Pool {
  return mysql.createPool({
    ...DB_CONFIG,
    waitForConnections: true,
    connectionLimit: 10,
    // An unhandled pool error (a MySQL restart, a killed connection) otherwise
    // takes down the whole Node process instead of surfacing as a failed query.
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,
  });
}

export const pool: Pool = globalForDb.mbpPool ?? createPool();

// Only cache in development. In production the module is evaluated once, so the
// cache is dead weight, and leaving a live pool handle on globalThis makes it
// harder to reason about shutdown.
if (process.env.NODE_ENV !== "production") {
  globalForDb.mbpPool = pool;
}

/**
 * Typed SELECT.
 *
 * `pool.query` returns `RowDataPacket[] | ResultSetHeader | ...`, which under
 * `strict: true` forces a cast at each of the ~40 call sites ported from the
 * Express handlers. Destructure the row shape here once instead:
 *
 *   const rows = await query<NewsRow>("SELECT * FROM news WHERE id = ?", [id]);
 */
export async function query<T = RowDataPacket>(
  sql: string,
  params?: unknown[],
): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

/** INSERT/UPDATE/DELETE, returning the header for `insertId` and `affectedRows`. */
export async function execute(
  sql: string,
  params?: unknown[],
): Promise<ResultSetHeader> {
  const [result] = await pool.query(sql, params);
  return result as ResultSetHeader;
}

/**
 * `SELECT COUNT(*)` returns a row, not a number. The dashboard handler unpacks
 * eight of them (server/app.js:801-807); this keeps that readable.
 *
 * `table` is interpolated, not parameterised, because MySQL will not accept a
 * placeholder for an identifier. Every caller passes a literal from ENTITY_MAP.
 */
export async function count(table: string, where = "", params: unknown[] = []): Promise<number> {
  const rows = await query<RowDataPacket & { c: number | string }>(
    `SELECT COUNT(*) AS c FROM \`${table}\`${where ? ` ${where}` : ""}`,
    params,
  );
  return Number(rows[0]?.c ?? 0);
}
