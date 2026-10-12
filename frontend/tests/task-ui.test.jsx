import { expect, test, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookingsPage from "../src/pages/BookingsPage.jsx";
import { api } from "../src/api.js";

vi.mock("../src/api.js", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, api: { listBookings: vi.fn(), cancelBooking: vi.fn() } };
});

// Fresh objects for every test.
function aliceBookings() {
  const base = { eventStartsAt: "2030-06-01T10:00:00.000Z", createdAt: "2030-05-01T09:00:00.000Z" };
  return [
    { ...base, id: 101, eventId: 1, eventTitle: "JavaScript Basics", seats: 1, status: "confirmed" },
    { ...base, id: 102, eventId: 2, eventTitle: "React Basics", seats: 2, status: "cancelled" },
    { ...base, id: 103, eventId: 3, eventTitle: "SQL Basics", seats: 1, status: "confirmed" },
  ];
}

async function renderAliceBookings() {
  const bookings = aliceBookings();
  api.listBookings.mockResolvedValue({ items: bookings });
  api.cancelBooking.mockImplementation(async (id) => ({
    ...bookings.find((b) => b.id === id),
    status: "cancelled",
  }));

  const user = userEvent.setup();
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <BookingsPage />
    </MemoryRouter>
  );
  await screen.findByRole("row", { name: "Booking 101" });
  return { user };
}

test("cancelled status appears without refresh", async () => {
  const { user } = await renderAliceBookings();
  const row = screen.getByRole("row", { name: "Booking 101" });

  await user.click(within(row).getByRole("button", { name: "Cancel" }));

  await waitFor(() => {
    expect(within(row).getByText("Cancelled")).toBeVisible();
  });
});
