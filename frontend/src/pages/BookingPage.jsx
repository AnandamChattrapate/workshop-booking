import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatDate } from "../api.js";

const STATUS_LABELS = { confirmed: "Confirmed", cancelled: "Cancelled" };

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setBooking(null);
    setError("");

    api
      .getBooking(id)
      .then((data) => active && setBooking(data))
      .catch((err) => active && setError(err.message));

    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <section>
        <p role="alert" className="error">{error}</p>
        <Link to="/bookings">Back to my bookings</Link>
      </section>
    );
  }
  if (!booking) return <p>Loading booking…</p>;

  return (
    <section className="card">
      <Link to="/bookings">← My bookings</Link>
      <h1>Booking #{booking.id}</h1>
      <dl className="details">
        <dt>Workshop</dt>
        <dd>
          <Link to={`/events/${booking.eventId}`}>{booking.eventTitle}</Link>
        </dd>
        <dt>Date</dt>
        <dd>{formatDate(booking.eventStartsAt)}</dd>
        <dt>Seats</dt>
        <dd>{booking.seats}</dd>
        <dt>Status</dt>
        <dd>{STATUS_LABELS[booking.status]}</dd>
        <dt>Booked by</dt>
        <dd>
          {booking.ownerName} ({booking.ownerEmail})
        </dd>
        <dt>Booked on</dt>
        <dd>{formatDate(booking.createdAt)}</dd>
      </dl>
    </section>
  );
}
