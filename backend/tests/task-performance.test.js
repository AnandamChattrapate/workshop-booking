import { expect, test, vi } from "vitest";
import { getAs, useSeedDatabase } from "./helpers.js";
import { pool, query } from "../src/db.js";

useSeedDatabase();

// Replaces all events and bookings with two events, each with one confirmed booking.
async function useTwoEventFixture() {
  await query("DELETE FROM bookings");
  await query("DELETE FROM events");
  await query(
    `INSERT INTO events (id, title, description, starts_at, location) VALUES
       (1, 'Event One', 'First event', '2030-06-01T10:00:00Z', 'Hall A'),
       (2, 'Event Two', 'Second event', '2030-06-02T10:00:00Z', 'Hall B')`
  );
  await query(
    `INSERT INTO bookings (id, user_id, event_id, seats, status) VALUES
       (301, 1, 1, 1, 'confirmed'),
       (302, 2, 2, 1, 'confirmed')`
  );
}

// Runs fn and counts the SELECT statements sent to PostgreSQL while it runs.
async function countSelects(fn) {
  const spy = vi.spyOn(pool, "query");
  try {
    const response = await fn();
    const selectCount = spy.mock.calls.filter(([text]) =>
      /^\s*select\b/i.test(String(text))
    ).length;
    return { response, selectCount };
  } finally {
    spy.mockRestore();
  }
}

test("summaries use at most two SELECTs", async () => {
  await useTwoEventFixture();

  const { response, selectCount } = await countSelects(() =>
    getAs("admin", "/admin/events")
  );

  expect(response.status).toBe(200);
  expect(response.body.items.map((event) => [event.id, event.confirmedBookings])).toEqual([
    [1, 1],
    [2, 1],
  ]);
  expect(selectCount).toBeLessThanOrEqual(2);
});
