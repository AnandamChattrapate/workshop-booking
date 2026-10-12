import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, formatDate } from "../api.js";

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setEvent(null);
    setError("");

    api
      .getEvent(id)
      .then((data) => active && setEvent(data))
      .catch((err) => active && setError(err.message));

    return () => {
      active = false;
    };
  }, [id]);

  async function handleBook(e) {
    e.preventDefault();
    setBookingError("");
    setSubmitting(true);

    try {
      const booking = await api.createBooking(event.id, seats);
      navigate(`/bookings/${booking.id}`);
    } catch (err) {
      setBookingError(err.message);
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <section>
        <p role="alert" className="error">Could not load this event: {error}</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  if (!event) return <p>Loading event…</p>;

  return (
    <section className="card">
      <Link to="/events">← All events</Link>
      <h1>{event.title}</h1>
      <dl className="details">
        <dt>Starts</dt>
        <dd>{formatDate(event.startsAt)}</dd>
        <dt>Location</dt>
        <dd>{event.locationLabel}</dd>
      </dl>
      <p>{event.description}</p>

      <form onSubmit={handleBook} className="form inline">
        <label>
          Seats
          <select value={seats} onChange={(e) => setSeats(Number(e.target.value))}>
            {SEAT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Booking…" : "Book seats"}
        </button>
      </form>
      {bookingError && <p role="alert" className="error">{bookingError}</p>}
    </section>
  );
}
