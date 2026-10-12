import { useEffect, useState } from "react";
import { api, formatDate } from "../api.js";

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .listAdminEvents()
      .then((data) => active && setEvents(data.items))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p>Loading event summaries…</p>;
  if (error) return <p role="alert" className="error">{error}</p>;

  return (
    <section>
      <h1>Admin: event summaries</h1>
      <p className="muted">
        Counts are confirmed booking <strong>records</strong>, not seats.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Workshop</th>
            <th>Date</th>
            <th>Confirmed bookings</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{formatDate(event.startsAt)}</td>
              <td>{event.confirmedBookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
