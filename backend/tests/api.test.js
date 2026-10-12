import { describe, expect, test } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app, getAs, postAs, useSeedDatabase } from "./helpers.js";

useSeedDatabase();

describe("auth", () => {
  test("valid login returns a token", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "Demo123!" });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({ id: 1, role: "user" });
  });

  test("invalid password is rejected", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "wrong" });

    expect(response.status).toBe(401);
  });

  test("missing JWT is rejected", async () => {
    const response = await request(app).get("/api/events");
    expect(response.status).toBe(401);
  });

  test("invalid JWT is rejected", async () => {
    const forged = jwt.sign({ role: "admin" }, "not-the-secret", { subject: "3" });
    const response = await request(app)
      .get("/api/events")
      .set("Authorization", `Bearer ${forged}`);

    expect(response.status).toBe(401);
  });

  test("a user cannot open the admin endpoint", async () => {
    const response = await getAs("alice", "/admin/events");
    expect(response.status).toBe(403);
  });

  test("an admin can open the admin endpoint", async () => {
    const response = await getAs("admin", "/admin/events");
    expect(response.status).toBe(200);
    expect(response.body.items[0]).toMatchObject({ id: 1, title: "JavaScript Basics" });
  });
});

describe("events", () => {
  test("event list returns all events in id order", async () => {
    const response = await getAs("alice", "/events");

    expect(response.status).toBe(200);
    expect(response.body.items.map((e) => e.id)).toEqual(
      Array.from({ length: 24 }, (_, i) => i + 1)
    );
  });

  test("a physical event loads with its location", async () => {
    const response = await getAs("alice", "/events/1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      title: "JavaScript Basics",
      locationLabel: "Hall A",
    });
  });
});

describe("bookings", () => {
  test("a user can read their own booking", async () => {
    const response = await getAs("alice", "/bookings/101");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 101,
      eventTitle: "JavaScript Basics",
      seats: 1,
      status: "confirmed",
    });
  });

  test("a missing booking returns 404", async () => {
    const response = await getAs("alice", "/bookings/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Booking not found" });
  });

  test("a valid booking is created", async () => {
    const response = await postAs("alice", "/bookings", { eventId: 4, seats: 2 });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ eventId: 4, seats: 2, status: "confirmed" });
  });

  test("an invalid seat count is rejected", async () => {
    const response = await postAs("alice", "/bookings", { eventId: 4, seats: 7 });
    expect(response.status).toBe(400);
  });

  test("a user cannot cancel another user's booking", async () => {
    const response = await postAs("alice", "/bookings/201/cancel");
    expect(response.status).toBe(404);

    const check = await getAs("ben", "/bookings/201");
    expect(check.body.status).toBe("confirmed");
  });
});
