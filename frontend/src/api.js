const TOKEN_KEY = "workshop.token";
const USER_KEY = "workshop.user";

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  return token && user ? { token, user: JSON.parse(user) } : null;
}

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const session = getSession();
  if (session) headers.Authorization = `Bearer ${session.token}`;

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new ApiError(response.status, data.error || "Request failed");
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  listEvents: () => request("/events"),
  getEvent: (id) => request(`/events/${id}`),
  getSummary: () => request("/bookings/summary"),
  listBookings: (status = "all") => request(`/bookings?status=${status}`),
  getBooking: (id) => request(`/bookings/${id}`),
  createBooking: (eventId, seats) =>
    request("/bookings", { method: "POST", body: { eventId, seats } }),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: "POST" }),
  listAdminEvents: () => request("/admin/events"),
};

export function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}
