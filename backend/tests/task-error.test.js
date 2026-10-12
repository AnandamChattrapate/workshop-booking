import { expect, test } from "vitest";
import { getAs, useSeedDatabase } from "./helpers.js";

useSeedDatabase();

test("an event with a null location loads", async () => {
  const response = await getAs("alice", "/events/2");

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    id: 2,
    title: "React Basics",
    locationLabel: "Online",
  });
});
