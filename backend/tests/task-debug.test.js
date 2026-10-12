import { expect, test } from "vitest";
import { getAs, useSeedDatabase } from "./helpers.js";

useSeedDatabase();

test("summary excludes cancelled seats", async () => {
  const response = await getAs("alice", "/bookings/summary");

  expect(response.status).toBe(200);
  expect(response.body.confirmedSeats).toBe(2);
});
