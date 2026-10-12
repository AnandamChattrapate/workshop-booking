import { Router } from "express";
import { requireAdmin, requireAuth } from "./auth.js";
import * as authController from "./controllers/authController.js";
import * as eventController from "./controllers/eventController.js";
import * as bookingController from "./controllers/bookingController.js";

export const router = Router();

// Wraps async handlers so rejected promises reach the error middleware.
const handle = (fn) => (req, res, next) => fn(req, res).catch(next);

router.post("/auth/login", handle(authController.login));

router.get("/events", requireAuth, handle(eventController.listEvents));
router.get("/events/:id", requireAuth, handle(eventController.getEvent));

// /bookings/summary must be declared before /bookings/:id.
router.get("/bookings", requireAuth, handle(bookingController.listBookings));
router.get("/bookings/summary", requireAuth, handle(bookingController.getSummary));
router.get("/bookings/:id", requireAuth, handle(bookingController.getBooking));
router.post("/bookings", requireAuth, handle(bookingController.createBooking));
router.post("/bookings/:id/cancel", requireAuth, handle(bookingController.cancelBooking));

router.get(
  "/admin/events",
  requireAuth,
  requireAdmin,
  handle(eventController.listAdminEventSummaries)
);
