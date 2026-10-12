# Ticket: The admin event list makes too many database queries

**Priority:** Medium
**Reported by:** Maya Chen, administrator
**Time limit:** 45 minutes

## What happened

> The Admin page gets slower every time we add workshops.

## Steps to reproduce

1. Start the app (database, backend, frontend) as described in README.md. Open http://localhost:3000.
2. Log in as `admin@example.com` with password `Demo123!`.
3. Open **Admin** (`/admin/events`). The page works, but the backend does extra work.
4. Run the task test. With 2 events, the request runs **3** SELECT queries.
   With the 24 demo events, it runs **25**. The number grows with every event.

## Expected behavior

- `GET /api/admin/events` runs **at most 2 SELECT queries**, for any number of events.
- Every event stays in the list, including events with **no** confirmed bookings (count 0).
- `confirmedBookings` counts confirmed booking **records**, not seats. Cancelled bookings do not count.
- Keep the order (ascending event ID) and numeric counts.
- Do not limit the list or add a cache.

## How to work

1. Use the admin account and reproduce the problem before you edit code.
2. Run the task test and read the failure:
   `cd backend && npm test -- tests/task-performance.test.js`
3. Make the smallest complete fix. Do not change `backend/tests/task-performance.test.js` or the seed data.
4. Run the task test again. Add your own tests for related cases. Then run all tests:
   `cd backend && npm test` and `cd frontend && npm test`
5. Write a short summary: the cause, your fix, and your test results.
