import * as bookingService from "../services/bookingService.js";
import * as eventService from "../services/eventService.js";
import { parseId } from "./params.js";

const STATUS_FILTERS = ["all", "confirmed", "cancelled"];
const NOT_FOUND = { error: "Booking not found" };

export async function listBookings(req, res) {
  const status = req.query.status ?? "all";

  if (!STATUS_FILTERS.includes(status)) {
    return res
      .status(400)
      .json({ error: "status must be all, confirmed, or cancelled" });
  }

  const items = await bookingService.listBookings(req.user.id, status);
  return res.json({ items });
}

export async function getSummary(req, res) {
  const summary = await bookingService.getBookingSummary(req.user.id);
  return res.json(summary);
}

export async function getBooking(req, res) {
  const id = parseId(req.params.id);
  const booking = id && (await bookingService.getBooking(id, req.user.id));

  if (!booking) {
    return res.status(404).json(NOT_FOUND);
  }
  return res.json(booking);
}

export async function createBooking(req, res) {
  const { eventId, seats } = req.body || {};

  if (!Number.isInteger(eventId) || eventId < 1) {
    return res.status(400).json({ error: "eventId must be a positive integer" });
  }
  if (!Number.isInteger(seats) || seats < 1 || seats > 6) {
    return res.status(400).json({ error: "seats must be between 1 and 6" });
  }
  if (!(await eventService.eventExists(eventId))) {
    return res.status(404).json({ error: "Event not found" });
  }

  const booking = await bookingService.createBooking(req.user.id, eventId, seats);
  return res.status(201).json(booking);
}

export async function cancelBooking(req, res) {
  const id = parseId(req.params.id);
  const booking = id && (await bookingService.cancelBooking(id, req.user.id));

  if (!booking) {
    return res.status(404).json(NOT_FOUND);
  }
  return res.json(booking);
}
