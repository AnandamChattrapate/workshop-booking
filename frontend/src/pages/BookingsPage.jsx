import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../api.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_LABELS = { confirmed: "Confirmed", cancelled: "Cancelled" };

export default function BookingsPage() {
  const [status, setStatus] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api
      .listBookings(status)
      .then((data) => active && setBookings(data.items))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [status]);

  async function handleCancel(id) {
    setCancelError("");
    try {
      const updated = await api.cancelBooking(id);
      const booking = bookings.find((item) => item.id === id);
      booking.status = updated.status;
      setBookings(bookings);
    } catch (err) {
      setCancelError(`Could not cancel booking ${id}: ${err.message}`);
    }
  }

  return (
    <section>
      <div className="page-head">
        <h1>My bookings</h1>
        <label>
          Status{" "}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {cancelError && <p role="alert" className="error">{cancelError}</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {loading && <p>Loading bookings…</p>}

      {!loading && !error && bookings.length === 0 && <p>No bookings found.</p>}

      {!loading && bookings.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Workshop</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} aria-label={`Booking ${booking.id}`}>
                <td>
                  <Link to={`/bookings/${booking.id}`}>#{booking.id}</Link>
                </td>
                <td>{booking.eventTitle}</td>
                <td>{formatDate(booking.eventStartsAt)}</td>
                <td>{booking.seats}</td>
                <td>{STATUS_LABELS[booking.status]}</td>
                <td>
                  {booking.status === "confirmed" && (
                    <button type="button" onClick={() => handleCancel(booking.id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
