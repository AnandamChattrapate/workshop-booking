# Ticket: "My confirmed seats" counts cancelled bookings

**Priority:** Medium
**Reported by:** Alice Green, a customer
**Time limit:** 45 minutes

## What happened

> The Workshops page says I have 4 confirmed seats. I only have two confirmed
> bookings, with one seat each. One of my bookings is cancelled.

## Steps to reproduce

1. Start the app (database, backend, frontend) as described in README.md. Open http://localhost:3000.
2. Log in as `alice@example.com` with password `Demo123!`.
3. Open the Workshops page (`/events`). Find **My confirmed seats**.
4. It shows **4**. Open My bookings: Alice has two confirmed one-seat bookings (101, 103)
   and one cancelled two-seat booking (102).

## Expected behavior

- **My confirmed seats** is the **sum of seats** in the user's **confirmed** bookings.
- Cancelled bookings add nothing.
- It counts seats, not bookings. A confirmed booking with 3 seats adds 3.
- A user with no confirmed bookings sees 0.
- Do not change booking records.

## How to work

1. Use the demo account and reproduce the problem before you edit code.
2. Run the task test and read the failure:
   `cd backend && npm test -- tests/task-debug.test.js`
3. Make the smallest complete fix. Do not change `backend/tests/task-debug.test.js` or the seed data.
4. Run the task test again. Add your own tests for related cases. Then run all tests:
   `cd backend && npm test` and `cd frontend && npm test`
5. Write a short summary: the cause, your fix, and your test results.
