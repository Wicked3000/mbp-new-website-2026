import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

/**
 * Idempotent schema self-healing, ported from the boot block in
 * `server/index.js:35-177`.
 *
 * ## Why this is not called automatically
 *
 * Express ran all of this inside `Promise.all([...]).finally(() => app.listen())`
 * at process start, so a fresh database was repaired before the first request.
 * The App Router has no boot hook - there is no module that runs exactly once
 * before the server accepts traffic - so the same work is exposed as
 * `npm run db:ensure` and run as a release step.
 *
 * That is a real behavioural difference worth naming: the old server repaired
 * itself, the new one has to be told. Running it as a release step is arguably
 * better (a migration that needs an ALTER should not silently run on every
 * restart), but it does mean a deploy that forgets the step serves 500s from
 * the admin until someone notices.
 *
 * Every helper is non-fatal by design and that behaviour is preserved: the API
 * serves whatever the database already has rather than refusing to start.
 *
 * ## Why this does not import lib/db.ts
 *
 * `lib/db.ts` carries `import "server-only"`, whose default export throws
 * outside a React Server Component. A migration script is not a server
 * component, so reusing that module would make `db:ensure` unrunnable. This
 * opens its own short-lived pool instead - the duplication is ten lines of
 * connection config, and a migration tool that owns its connection is easier to
 * run against a database the app itself is not using.
 */
const DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  waitForConnections: true,
  connectionLimit: 2,
};

let pool: Pool | null = null;

function getPool(): Pool {
  pool ??= mysql.createPool(DB);
  return pool;
}

async function query<T = RowDataPacket>(sql: string, params?: unknown[]): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}

async function execute(sql: string): Promise<void> {
  await getPool().query(sql);
}

async function addColumnIfMissing(
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  try {
    const rows = await query<RowDataPacket & { count: number | string }>(
      "SELECT COUNT(*) AS count FROM information_schema.columns " +
        "WHERE table_schema = ? AND table_name = ? AND column_name = ?",
      [DB.database, table, column],
    );
    if (Number(rows[0]?.count) === 0) {
      await execute(`ALTER TABLE \`${table}\` ADD COLUMN ${column} ${definition}`);
      console.log(`[schema] added ${table}.${column}`);
    }
  } catch (error) {
    console.error(`Unable to ensure ${table}.${column}:`, (error as Error).message);
  }
}

async function ensureTable(sql: string): Promise<void> {
  try {
    await execute(sql);
  } catch (error) {
    console.error("Unable to ensure table:", (error as Error).message);
  }
}

/**
 * Fails fast if the database is not reachable.
 *
 * Every helper above swallows its own errors, and that is right for the Express
 * server - it repaired what it could and served the rest. It is wrong for the
 * CLI: `npm run db:ensure` in a release pipeline that exits 0 against a dead
 * database reports success, the deploy proceeds, and the admin serves 500s
 * because nothing was applied.
 *
 * The distinction is "could not reach the database at all" (fatal, nothing can
 * be done) versus "this one statement was refused" (tolerated, and logged
 * above). Only the former should stop the run.
 */
export async function assertDatabaseReachable(): Promise<void> {
  try {
    await query("SELECT 1");
  } catch (error) {
    throw new Error(
      `Cannot reach the database at ${DB.host}:${DB.port}/${DB.database}. ` +
        `Start MySQL and check DB_HOST/DB_PORT/DB_USER/DB_PASSWORD in .env. ` +
        `Underlying error: ${(error as Error).message}`,
    );
  }
}

const ensureAuthVersionColumn = () =>
  addColumnIfMissing("users", "auth_version", "INT NOT NULL DEFAULT 1");

const ensurePartnerLogoColumn = () => addColumnIfMissing("partners", "logo", "TEXT DEFAULT NULL");

const ensureSelectionGrade11Columns = async () => {
  for (const column of ["capacity", "placed", "cutoff"]) {
    await addColumnIfMissing("selections_grade11", column, "INT NULL");
  }
};

const ensureWhatsAppSubscribersTable = () =>
  ensureTable(`CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(20) NOT NULL UNIQUE,
      source VARCHAR(120) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

const ensureSelectionStudentsTable = () =>
  ensureTable(`CREATE TABLE IF NOT EXISTS selection_students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      grade_level TINYINT NOT NULL,
      school VARCHAR(180) NOT NULL,
      position_no INT NULL,
      primary_school VARCHAR(180) NOT NULL DEFAULT '',
      surname VARCHAR(120) NOT NULL DEFAULT '',
      first_name VARCHAR(120) NOT NULL DEFAULT '',
      gender VARCHAR(20) NOT NULL DEFAULT '',
      student_name VARCHAR(220) NOT NULL DEFAULT '',
      slf_no VARCHAR(60) NOT NULL DEFAULT '',
      transferred_from VARCHAR(180) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_selection_grade_school (grade_level, school)
    ) ENGINE=InnoDB`);

/**
 * The full boot list, verbatim from server/index.js:106-177. Kept as one array
 * so `db:ensure` stays a single pass and the ordering matches what the Express
 * server used to do.
 */
export async function ensureSchema(): Promise<void> {
  await Promise.all([
    ensureAuthVersionColumn(),
    ensurePartnerLogoColumn(),
    ensureWhatsAppSubscribersTable(),
    ensureSelectionStudentsTable(),
    ensureSelectionGrade11Columns(),
    addColumnIfMissing("downloads", "program", "VARCHAR(40) NOT NULL DEFAULT '' AFTER file_path"),
    addColumnIfMissing("downloads", "sort_order", "INT NOT NULL DEFAULT 0"),
  ]);

  // Tables backing the admin-managed page sections. The seed content lives in
  // the matching *_seed.sql files under backend/database, applied separately.
  const SECTION_TABLES: string[] = [
    "basic_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "basic_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "basic_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_overview_cards_order (sort_order))",
    "basic_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_overview_features_order (sort_order))",
    "basic_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0B2545]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_overview_stats_order (sort_order))",
    "basic_curriculum (id INT AUTO_INCREMENT PRIMARY KEY, area VARCHAR(160) NOT NULL DEFAULT '', grades VARCHAR(40) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_curriculum_order (sort_order))",
    "basic_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_initiatives_order (sort_order))",
    "basic_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_support_order (sort_order))",
    "basic_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_basic_faq_order (sort_order))",
    "basic_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0)",
    "basic_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0)",
    "post_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "post_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "post_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_overview_cards_order (sort_order))",
    "post_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_overview_features_order (sort_order))",
    "post_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#163663]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_overview_stats_order (sort_order))",
    "post_streams (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(160) NOT NULL DEFAULT '', grades VARCHAR(40) NOT NULL DEFAULT '', subjects TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_streams_order (sort_order))",
    "post_assessment (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', bullet TEXT, sort_order INT NOT NULL DEFAULT 0)",
    "post_pathways (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500', stats VARCHAR(120) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_pathways_order (sort_order))",
    "post_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-amber-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_initiatives_order (sort_order))",
    "post_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_support_order (sort_order))",
    "post_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0)",
    "post_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_post_faq_order (sort_order))",
    "post_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0)",
    "vet_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "vet_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "vet_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_overview_cards_order (sort_order))",
    "vet_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_overview_features_order (sort_order))",
    "vet_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0D9488]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_overview_stats_order (sort_order))",
    "vet_programs (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(40) NOT NULL DEFAULT '', name VARCHAR(200) NOT NULL DEFAULT '', duration VARCHAR(60) NOT NULL DEFAULT '', level VARCHAR(40) NOT NULL DEFAULT '', trades TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-amber-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_programs_order (sort_order))",
    "vet_centres (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', district VARCHAR(120) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT 'Operational', programs TEXT, capacity VARCHAR(40) NOT NULL DEFAULT '', facilities TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_centres_order (sort_order))",
    "vet_centre_names (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_centre_names_order (sort_order))",
    "vet_partners (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', sector VARCHAR(160) NOT NULL DEFAULT '', programs TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_partners_order (sort_order))",
    "vet_apprenticeship (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, bullet TEXT, sort_order INT NOT NULL DEFAULT 0)",
    "vet_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_initiatives_order (sort_order))",
    "vet_enrolment_steps (id INT AUTO_INCREMENT PRIMARY KEY, step VARCHAR(8) NOT NULL DEFAULT '', title VARCHAR(200) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_enrolment_steps_order (sort_order))",
    "vet_intake_dates (id INT AUTO_INCREMENT PRIMARY KEY, label VARCHAR(200) NOT NULL DEFAULT '', date_text VARCHAR(80) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_intake_dates_order (sort_order))",
    "vet_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_support_order (sort_order))",
    "vet_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0)",
    "vet_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_vet_faq_order (sort_order))",
    "vet_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0)",
    "fode_hero (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', title VARCHAR(160) NOT NULL DEFAULT '', subtitle VARCHAR(160) NOT NULL DEFAULT '', description TEXT, banner VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "fode_overview (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', intro TEXT, body TEXT, features_title VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "fode_overview_cards (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_overview_cards_order (sort_order))",
    "fode_overview_features (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_overview_features_order (sort_order))",
    "fode_overview_stats (id INT AUTO_INCREMENT PRIMARY KEY, value_text VARCHAR(80) NOT NULL DEFAULT '', label VARCHAR(120) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-[#0B2545]', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_overview_stats_order (sort_order))",
    "fode_programs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', level VARCHAR(40) NOT NULL DEFAULT '', duration VARCHAR(60) NOT NULL DEFAULT '', subjects TEXT, target VARCHAR(255) NOT NULL DEFAULT '', icon VARCHAR(16) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-blue-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_programs_order (sort_order))",
    "fode_centres (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', district VARCHAR(120) NOT NULL DEFAULT '', centre_type VARCHAR(60) NOT NULL DEFAULT 'Main Centre', students VARCHAR(40) NOT NULL DEFAULT '', facilities TEXT, coordinator VARCHAR(160) NOT NULL DEFAULT '', icon VARCHAR(16) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_centres_order (sort_order))",
    "fode_delivery_methods (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', availability VARCHAR(120) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_delivery_methods_order (sort_order))",
    "fode_app_callout (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, bullet TEXT, sort_order INT NOT NULL DEFAULT 0)",
    "fode_enrolment_steps (id INT AUTO_INCREMENT PRIMARY KEY, step VARCHAR(8) NOT NULL DEFAULT '', title VARCHAR(200) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_enrolment_steps_order (sort_order))",
    "fode_key_dates (id INT AUTO_INCREMENT PRIMARY KEY, label VARCHAR(200) NOT NULL DEFAULT '', date_text VARCHAR(120) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_key_dates_order (sort_order))",
    "fode_support (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_support_order (sort_order))",
    "fode_support_contact (id INT AUTO_INCREMENT PRIMARY KEY, heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_value VARCHAR(120) NOT NULL DEFAULT '', email_label VARCHAR(160) NOT NULL DEFAULT '', email_value VARCHAR(190) NOT NULL DEFAULT '', whatsapp_label VARCHAR(160) NOT NULL DEFAULT '', whatsapp_value VARCHAR(120) NOT NULL DEFAULT '', office_label VARCHAR(160) NOT NULL DEFAULT '', office_value VARCHAR(255) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/contact', sort_order INT NOT NULL DEFAULT 0)",
    "fode_initiatives (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL DEFAULT '', `desc` TEXT, icon VARCHAR(16) NOT NULL DEFAULT '', status VARCHAR(60) NOT NULL DEFAULT '', color VARCHAR(60) NOT NULL DEFAULT 'bg-teal-500', sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_initiatives_order (sort_order))",
    "fode_faq (id INT AUTO_INCREMENT PRIMARY KEY, q TEXT NOT NULL, a TEXT, sort_order INT NOT NULL DEFAULT 0, INDEX idx_fode_faq_order (sort_order))",
    "fode_section_headings (id INT AUTO_INCREMENT PRIMARY KEY, skey VARCHAR(80) NOT NULL UNIQUE, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', blurb TEXT, sort_order INT NOT NULL DEFAULT 0)",
    "home_mission (id INT AUTO_INCREMENT PRIMARY KEY, eyebrow VARCHAR(160) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', heading_accent VARCHAR(255) NOT NULL DEFAULT '', para1 TEXT, para2 TEXT, image VARCHAR(255) DEFAULT NULL, image_alt VARCHAR(255) NOT NULL DEFAULT '', badge_value VARCHAR(40) NOT NULL DEFAULT '', badge_label VARCHAR(160) NOT NULL DEFAULT '', badge_sub VARCHAR(190) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_href VARCHAR(255) NOT NULL DEFAULT '/about', sort_order INT NOT NULL DEFAULT 0)",
    "home_mission_points (id INT AUTO_INCREMENT PRIMARY KEY, feature TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0, INDEX idx_home_mission_points_order (sort_order))",
    "home_selection_banner (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(16) NOT NULL DEFAULT '', title VARCHAR(255) NOT NULL DEFAULT '', badge VARCHAR(40) NOT NULL DEFAULT '', body TEXT, primary_label VARCHAR(120) NOT NULL DEFAULT '', primary_href VARCHAR(255) NOT NULL DEFAULT '/selections', secondary_label VARCHAR(120) NOT NULL DEFAULT '', secondary_href VARCHAR(255) NOT NULL DEFAULT '/downloads', sort_order INT NOT NULL DEFAULT 0)",
    "home_cta (id INT AUTO_INCREMENT PRIMARY KEY, badge VARCHAR(60) NOT NULL DEFAULT '', heading VARCHAR(255) NOT NULL DEFAULT '', body TEXT, sub_body TEXT, image VARCHAR(255) DEFAULT NULL, image_alt VARCHAR(255) NOT NULL DEFAULT '', tagline VARCHAR(160) NOT NULL DEFAULT '', form_title VARCHAR(200) NOT NULL DEFAULT '', form_body TEXT, phone_label VARCHAR(160) NOT NULL DEFAULT '', phone_placeholder VARCHAR(60) NOT NULL DEFAULT '', channel_label VARCHAR(160) NOT NULL DEFAULT '', channel_prompt VARCHAR(120) NOT NULL DEFAULT '', button_label VARCHAR(120) NOT NULL DEFAULT '', button_loading_label VARCHAR(160) NOT NULL DEFAULT '', response_note VARCHAR(255) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0)",
    "home_cta_channels (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(160) NOT NULL DEFAULT '', sort_order INT NOT NULL DEFAULT 0, INDEX idx_home_cta_channels_order (sort_order))",
  ];

  // Sequential, where the Express version used Promise.all. CREATE TABLE and
  // ALTER TABLE take MySQL metadata locks, and issuing sixty of them at once
  // serialises on that lock anyway while making the failure mode a deadlock
  // rather than a readable error. Each statement is idempotent, so a partial
  // run is safe to repeat.
  for (const columns of SECTION_TABLES) {
    await ensureTable(`CREATE TABLE IF NOT EXISTS ${columns} ENGINE=InnoDB`);
  }
}

/** Closes the pool. Called by the db:ensure script, which is a short process. */
export async function closePool(): Promise<void> {
  await pool?.end();
  pool = null;
}
