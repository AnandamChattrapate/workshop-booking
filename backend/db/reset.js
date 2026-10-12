// Recreates the schema and loads seed data.
// Usage: npm run db:reset  (uses DATABASE_URL)
import { pool, resetDatabase } from "../src/db.js";

await resetDatabase();
console.log("Database reset with seed data.");
await pool.end();
