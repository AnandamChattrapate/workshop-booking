import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    environment: "node",
    // All tests share one test database, so run files one at a time.
    fileParallelism: false,
    env: {
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5433/workshop_test",
      JWT_SECRET: "test-secret",
    },
  },
});
