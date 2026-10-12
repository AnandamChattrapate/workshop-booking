import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../api.js";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([api.listEvents(), api.getSummary()])
      .then(([eventData, summaryData]) => {
        if (!active) return;
        setEvents(eventData.items);
        setSummary(summaryData);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p>Loading events…</p>;
  if (error) return <p role="alert" className="error">{error}</p>;

  return (
    <section>
      <div className="page-head">
        <h1>Workshops</h1>
        <div className="stat" aria-label="My confirmed seats">
          <span className="stat-label">My confirmed seats</span>
          <span className="stat-value">{summary.confirmedSeats}</span>
        </div>
      </div>

      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="card">
            <h2>
              <Link to={`/events/${event.id}`}>{event.title}</Link>
            </h2>
            <p className="muted">{formatDate(event.startsAt)}</p>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
