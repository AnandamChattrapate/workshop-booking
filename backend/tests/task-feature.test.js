import { expect, test } from "vitest";
import { getAs, useSeedDatabase } from "./helpers.js";

useSeedDatabase();

test("confirmed filter excludes cancelled bookings", async () => {
  const response = await getAs("alice", "/bookings?status=confirmed");

  expect(response.status).toBe(200);
  expect(response.body.items.map((booking) => booking.id)).toEqual([101, 103]);
});
