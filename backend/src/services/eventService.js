import { query } from "../db.js";

// Formats the event location for display.
export function formatLocation(location) {
  return location.trim();
}

function toEventSummary(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at.toISOString(),
  };
}

export async function listEvents() {
  const { rows } = await query(
    "SELECT id, title, description, starts_at FROM events ORDER BY id"
  );
  return rows.map(toEventSummary);
}

// Returns the event, or null when it does not exist.
export async function getEvent(id) {
  const { rows } = await query(
    "SELECT id, title, description, starts_at, location FROM events WHERE id = $1",
    [id]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    ...toEventSummary(row),
    locationLabel: formatLocation(row.location),
  };
}

export async function eventExists(id) {
  const { rows } = await query("SELECT 1 FROM events WHERE id = $1", [id]);
  return rows.length > 0;
}

async function loadEvents() {
  const { rows } = await query("SELECT id, title, starts_at FROM events ORDER BY id");
  return rows;
}

async function countConfirmedBookings(eventId) {
  const { rows } = await query(
    "SELECT COUNT(*)::int AS count FROM bookings WHERE event_id = $1 AND status = 'confirmed'",
    [eventId]
  );
  return rows[0].count;
}

// Admin view: every event with its number of confirmed booking records.
export async function getAdminEventSummaries() {
  const events = await loadEvents();
  const summaries = [];

  for (const event of events) {
    summaries.push({
      id: event.id,
      title: event.title,
      startsAt: event.starts_at.toISOString(),
      confirmedBookings: await countConfirmedBookings(event.id),
    });
  }

  return summaries;
}
