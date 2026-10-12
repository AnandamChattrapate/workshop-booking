import { expect, test } from "vitest";
import { getAs, useSeedDatabase } from "./helpers.js";

useSeedDatabase();

test("Alice cannot read Ben's booking", async () => {
  const response = await getAs("alice", "/bookings/201");

  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: "Booking not found" });
});
