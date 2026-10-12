import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(here, "..", "db");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5433/workshop";

export const pool = new pg.Pool({ connectionString, max: 5 });

// Every query in the app goes through this function.
export function query(text, params = []) {
  return pool.query(text, params);
}

export async function resetDatabase() {
  const schema = fs.readFileSync(path.join(dbDir, "schema.sql"), "utf8");
  const seed = fs.readFileSync(path.join(dbDir, "seed.sql"), "utf8");
  await pool.query(schema);
  await pool.query(seed);
}

// Loads seed data only when the database is empty (first start).
export async function ensureDatabase() {
  let rows;
  try {
    ({ rows } = await pool.query("SELECT to_regclass('public.bookings') AS table_name"));
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      console.error(
        `Cannot connect to PostgreSQL at ${connectionString.replace(/:[^:@/]+@/, ":***@")}.\n` +
          "Start it from the project folder with: docker compose up"
      );
      process.exit(1);
    }
    throw err;
  }
  if (!rows[0].table_name) {
    await resetDatabase();
    console.log("Database created with seed data.");
  }
}
