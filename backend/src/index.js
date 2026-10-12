import { createApp } from "./app.js";
import { ensureDatabase } from "./db.js";

const port = Number(process.env.PORT || 4000);

await ensureDatabase();

createApp().listen(port, () => {
  console.log(`Workshop Booking API running at http://localhost:${port}`);
});
