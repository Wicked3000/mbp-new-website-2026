import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createApp } from "../app.js";
import { createFakePool, silentLogger } from "./fakePool.js";

const PASSWORD = "correct horse battery";
let uploadDir;
let app;
let pool;
let admin;

beforeEach(async () => {
  uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), "mbp-uploads-"));
  pool = createFakePool({
    users: [
      {
        id: 1,
        username: "admin",
        email: "admin@example.pg",
        password_hash: await bcrypt.hash(PASSWORD, 4),
      },
    ],
    tables: {
      news: [{ id: 1, title: "Term timetable" }],
      selection_students: [{ id: 1, surname: "Kila" }],
    },
  });
  app = createApp({
    pool,
    jwtSecret: "test-secret-that-is-definitely-long-enough",
    uploadDir,
    logger: silentLogger,
  });
  admin = null;
});

afterEach(() => fs.rmSync(uploadDir, { recursive: true, force: true }));

const login = () =>
  request(app).post("/api/auth/login").send({ username: "admin", password: PASSWORD });

async function signIn() {
  const res = await login();
  return res.body.token;
}

describe("login", () => {
  it("rejects a request without credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({ username: "admin" });
    expect(res.status).toBe(400);
  });

  it("rejects a wrong password and never echoes the hash", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "nope" });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
    expect(JSON.stringify(res.body)).not.toContain("$2a$");
  });

  it("returns a token and the public user fields only", async () => {
    const res = await login();
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toEqual({
      id: 1,
      username: "admin",
      email: "admin@example.pg",
      role: "super_admin",
    });
    expect(res.body.user.password_hash).toBeUndefined();
  });

  it("treats the seeded empty password_hash as locked, not blank", async () => {
    pool.state.users[0].password_hash = "";
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "anything at all" });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/no password/i);
  });

  it("throttles credential stuffing", async () => {
    for (let i = 0; i < 10; i += 1) {
      await request(app)
        .post("/api/auth/login")
        .send({ username: "admin", password: `guess-${i}` });
    }
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "guess-x" });
    expect(res.status).toBe(429);
    expect(res.headers["retry-after"]).toBeTruthy();
  });
});

describe("entities", () => {
  it("serves public content without a token", async () => {
    const res = await request(app).get("/api/entities?entity=news");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("keeps student names admin-only", async () => {
    const res = await request(app).get("/api/entities?entity=selection_students");
    expect(res.status).toBe(401);
  });

  it("refuses writes without a token", async () => {
    const res = await request(app).post("/api/entities?entity=news").send({ title: "nope" });
    expect(res.status).toBe(401);
  });

  it("accepts a write with a valid token", async () => {
    const token = await signIn();
    const res = await request(app)
      .post("/api/entities?entity=news")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Term timetable" });
    expect(res.status).toBe(201);
  });

  it("refuses prototype keys as entities", async () => {
    for (const entity of ["__proto__", "constructor", "toString"]) {
      const res = await request(app).get(`/api/entities?entity=${entity}`);
      expect(res.status).toBe(400);
    }
  });

  it("never selects password_hash for the users entity", async () => {
    const token = await signIn();
    await request(app).get("/api/entities?entity=users").set("Authorization", `Bearer ${token}`);
    const usersQuery = pool.queries.find((q) => /^SELECT .* FROM `?users`? ORDER BY/i.test(q.sql));
    expect(usersQuery.sql).toMatch(/SELECT `id`,`username`,`email`,`role` FROM/);
    expect(usersQuery.sql).not.toMatch(/\*/);
  });

  it("marks users read-only", async () => {
    const token = await signIn();
    const res = await request(app)
      .delete("/api/entities?entity=users&id=1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("hides SQL text behind a generic 500", async () => {
    pool.query = async () => {
      throw new Error("ER_PARSE_ERROR near 'secret_column'");
    };
    const res = await request(app).get("/api/entities?entity=news");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("DB error");
  });

  it("serves the legacy .php paths the browser client still uses", async () => {
    const res = await request(app).post("/api/contact.php").send({
      full_name: "A Teacher",
      email: "teacher@example.pg",
      subject: "Enquiry",
      message: "Hello",
    });
    expect(res.status).toBe(200);
    expect(pool.state.tables.contact_messages).toHaveLength(1);
  });
});

describe("change password", () => {
  const NEW = "a different long passphrase";

  it("needs the current password", async () => {
    const token = await signIn();
    const res = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ current_password: "wrong", new_password: NEW });
    expect(res.status).toBe(401);
  });

  it("refuses short passwords", async () => {
    const token = await signIn();
    const res = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ current_password: PASSWORD, new_password: "short" });
    expect(res.status).toBe(400);
  });

  it("replaces the hash, bumps the version and retires old tokens", async () => {
    const oldToken = await signIn();
    const res = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${oldToken}`)
      .send({ current_password: PASSWORD, new_password: NEW });
    expect(res.status).toBe(200);

    // The old token is dead everywhere, not just on the change endpoint.
    const stale = await request(app)
      .get("/api/entities?entity=selection_students")
      .set("Authorization", `Bearer ${oldToken}`);
    expect(stale.status).toBe(401);

    // The replacement token works.
    const fresh = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${res.body.token}`);
    expect(fresh.status).toBe(200);

    // And the new password is the one that now logs in.
    const relogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: NEW });
    expect(relogin.status).toBe(200);
    const oldPassword = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: PASSWORD });
    expect(oldPassword.status).toBe(401);
  });
});

describe("uploads", () => {
  it("rejects SVG", async () => {
    const token = await signIn();
    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("<svg><script>alert(1)</script></svg>"), "logo.svg");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/svg/i);
  });

  it("stores a png under a relative url", async () => {
    const token = await signIn();
    const res = await request(app)
      .post("/api/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from([0x89, 0x50, 0x4e, 0x47]), "logo.png");
    expect(res.status).toBe(200);
    expect(res.body.url).toMatch(/^\/uploads\/logo_\d+_[a-z0-9]+\.png$/);
  });

  it("needs a token", async () => {
    const res = await request(app)
      .post("/api/upload")
      .attach("file", Buffer.from([0x89, 0x50, 0x4e, 0x47]), "logo.png");
    expect(res.status).toBe(401);
  });
});

describe("CORS", () => {
  it("grants configured origins only", async () => {
    const allowed = await request(app).get("/api/health").set("Origin", "http://localhost:8443");
    expect(allowed.headers["access-control-allow-origin"]).toBe("http://localhost:8443");

    const blocked = await request(app).get("/api/health").set("Origin", "https://evil.example");
    expect(blocked.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
