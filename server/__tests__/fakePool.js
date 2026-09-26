// Minimal in-memory stand-in for a mysql2 pool. Every query is recorded so the
// tests can assert on the SQL the API actually issues - that is how the
// password_hash leaks are caught.
export function createFakePool({ users = [], tables = {} } = {}) {
  const queries = [];
  const state = {
    users: users.map((u) => ({ role: "super_admin", auth_version: 1, ...u })),
    tables: structuredClone(tables),
  };

  const rowsOf = (table) => state.tables[table] || [];
  const project = (row, columns) => Object.fromEntries(columns.map((c) => [c, row[c]]));

  async function query(sql, params = []) {
    queries.push({ sql: String(sql), params });
    const text = String(sql).replace(/\s+/g, " ").trim();
    const table = text.match(/(?:FROM|INTO|UPDATE)\s+`?(\w+)`?/i)?.[1];

    if (table === "users" && /^SELECT/i.test(text)) {
      const columns = (text.match(/^SELECT (.+?) FROM users/i)?.[1] || "id, username, email, role")
        .split(",")
        .map((c) => c.trim().replace(/`/g, ""));
      let found = state.users;
      if (/username=\? OR email=\?/i.test(text)) {
        const [value] = params;
        found = found.filter((u) => u.username === value || u.email === value);
      } else if (/id=\?/i.test(text)) {
        const [value] = params;
        found = found.filter((u) => String(u.id) === String(value));
      }
      if (/^SELECT auth_version/i.test(text)) {
        return [found.map((u) => ({ auth_version: u.auth_version }))];
      }
      return [found.map((u) => project(u, columns))];
    }
    if (/^SELECT COUNT\(\*\) c FROM (\w+)/i.test(text)) {
      return [[{ c: rowsOf(table).length }]];
    }
    if (/^SELECT/i.test(text)) return [[...rowsOf(table)]];
    if (/^INSERT/i.test(text)) {
      const columns = (text.match(/^INSERT INTO \w+ \((.+?)\)/i)?.[1] || "")
        .split(",")
        .map((c) => c.trim().replace(/`/g, ""));
      const row = Object.fromEntries(columns.map((c, i) => [c, params[i]]));
      state.tables[table] = [...rowsOf(table), { id: rowsOf(table).length + 1, ...row }];
      return [{ insertId: rowsOf(table).length }];
    }
    if (/^UPDATE/i.test(text)) {
      const assignments = (text.match(/^UPDATE \w+ SET (.+?)(?: WHERE .*)?$/i)?.[1] || "")
        .split(",")
        .map((a) => a.split("=")[0].trim().replace(/`/g, ""));
      const id = params.at(-1);
      const targets =
        table === "users" ? state.users.filter((u) => String(u.id) === String(id)) : rowsOf(table);
      assignments.forEach((column, i) => {
        targets.forEach((row) => {
          row[column] = params[i];
        });
      });
      return [{ affectedRows: targets.length }];
    }
    return [{ affectedRows: 1 }];
  }

  return { query, queries, state };
}

export const silentLogger = { log() {}, warn() {}, error() {} };
