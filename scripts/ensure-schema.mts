/**
 * Applies the idempotent schema self-healing that the Express server used to run
 * at boot (server/index.js:35-177). See lib/ensure-schema.ts for why this is a
 * separate step rather than automatic.
 *
 *   npm run db:ensure
 *
 * Run it once after importing backend/database/mbp_education.sql, and again as
 * a release step whenever the schema changes.
 */
import { assertDatabaseReachable, ensureSchema, closePool } from "../lib/ensure-schema.ts";

try {
  // Fatal if the database is unreachable, so a release pipeline cannot report
  // success while having applied nothing. Individual statements stay tolerant.
  await assertDatabaseReachable();
  await ensureSchema();
  console.log("[schema] done");
} catch (error) {
  console.error("[schema] failed:", (error as Error).message);
  process.exitCode = 1;
} finally {
  await closePool();
}