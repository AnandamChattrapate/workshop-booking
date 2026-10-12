import { useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "./api.js";
import LoginPage from "./pages/LoginPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import EventPage from "./pages/EventPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function RequireSession({ session, children }) {
  return session ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [session, setSession] = useState(getSession);
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    setSession(null);
    navigate("/login");
  }

  const guard = (page) => <RequireSession session={session}>{page}</RequireSession>;

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/events" className="brand">
          Workshop Booking
        </Link>
        {session && (
          <nav>
            <Link to="/events">Events</Link>
            <Link to="/bookings">My bookings</Link>
            {session.user.role === "admin" && <Link to="/admin/events">Admin</Link>}
            <span className="who">{session.user.name}</span>
            <button type="button" className="link-button" onClick={handleLogout}>
              Log out
            </button>
          </nav>
        )}
      </header>

      <main className="content">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setSession} />} />
          <Route path="/events" element={guard(<EventsPage />)} />
          <Route path="/events/:id" element={guard(<EventPage />)} />
          <Route path="/bookings" element={guard(<BookingsPage />)} />
          <Route path="/bookings/:id" element={guard(<BookingPage />)} />
          <Route path="/admin/events" element={guard(<AdminPage />)} />
          <Route path="*" element={<Navigate to={session ? "/events" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
