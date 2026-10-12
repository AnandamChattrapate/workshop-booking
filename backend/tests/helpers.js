// Shared helpers for API tests.
// Each test starts from a fresh copy of the seed data and uses real JWTs.
import { afterAll, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { pool, resetDatabase } from "../src/db.js";
import { signToken } from "../src/auth.js";

// One test server bound to 127.0.0.1. Binding explicitly makes sure requests
// reach this server and never another local process on the same port.
export const app = createApp().listen(0, "127.0.0.1");

export const USERS = {
  alice: { id: 1, name: "Alice Green", role: "user" },
  ben: { id: 2, name: "Ben Patel", role: "user" },
  admin: { id: 3, name: "Maya Chen", role: "admin" },
};

export function tokenFor(userKey) {
  return signToken(USERS[userKey]);
}

export function getAs(userKey, path) {
  return request(app).get(`/api${path}`).set("Authorization", `Bearer ${tokenFor(userKey)}`);
}

export function postAs(userKey, path, body) {
  return request(app)
    .post(`/api${path}`)
    .set("Authorization", `Bearer ${tokenFor(userKey)}`)
    .send(body);
}

// Call once at the top of each API test file.
export function useSeedDatabase() {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await new Promise((resolve) => app.close(resolve));
    await pool.end();
  });
}
