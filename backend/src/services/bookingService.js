import { query } from "../db.js";

const BOOKING_COLUMNS = `
  b.id,
  b.user_id,
  b.event_id,
  b.seats,
  b.status,
  b.created_at,
  e.title AS event_title,
  e.starts_at AS event_starts_at,
  u.name AS owner_name,
  u.email AS owner_email
`;

const BOOKING_FROM = `
  FROM bookings b
  JOIN events e ON e.id = b.event_id
  JOIN users u ON u.id = b.user_id
`;

function toBooking(row) {
  return {
    id: row.id,
    eventId: row.event_id,
    eventTitle: row.event_title,
    eventStartsAt: row.event_starts_at.toISOString(),
    seats: row.seats,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    ownerName: row.owner_name,
    ownerEmail: row.owner_email,
  };
}

export async function listBookings(userId, status) {
  const { rows } = await query(
    `SELECT ${BOOKING_COLUMNS}
     ${BOOKING_FROM}
     WHERE b.user_id = $1
     ORDER BY b.id`,
    [userId]
  );
  return rows.map(toBooking);
}

export async function getBookingSummary(userId) {
  const { rows } = await query(
    "SELECT seats, status FROM bookings WHERE user_id = $1",
    [userId]
  );

  const confirmedSeats = rows.reduce((total, booking) => total + booking.seats, 0);

  return { confirmedSeats };
}

// Returns the booking with its event and owner details, or null.
export async function getBooking(id, userId) {
  const { rows } = await query(
    `SELECT ${BOOKING_COLUMNS}
     ${BOOKING_FROM}
     WHERE b.id = $1`,
    [id]
  );
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function createBooking(userId, eventId, seats) {
  const { rows } = await query(
    `INSERT INTO bookings (user_id, event_id, seats, status)
     VALUES ($1, $2, $3, 'confirmed')
     RETURNING id`,
    [userId, eventId, seats]
  );
  return getBooking(rows[0].id, userId);
}

export async function cancelBooking(id, userId) {
  const { rowCount } = await query(
    `UPDATE bookings
     SET status = 'cancelled'
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (rowCount === 0) return null;
  return getBooking(id, userId);
}
