# Ticket: Finish the booking status filter

**Priority:** Medium
**Requested by:** Product team
**Time limit:** 45 minutes

## What is missing

The **Status** dropdown on My bookings is already built. The frontend sends
`?status=confirmed` (or `cancelled`, `all`) to the API, and the controller validates it.
The backend does not use the value yet, so the list never changes.

## Steps to see it

1. Start the app (database, backend, frontend) as described in README.md. Open http://localhost:3000.
2. Log in as `alice@example.com` with password `Demo123!`.
3. Open **My bookings** (`/bookings`) and select **Confirmed**.
4. The request contains `?status=confirmed`, but cancelled booking **102** still appears.

## Required behavior

Implement the filter in the backend list query for `GET /api/bookings`:

| `status` value | Result |
|---|---|
| `confirmed` | Only confirmed bookings |
| `cancelled` | Only cancelled bookings |
| `all`, or no `status` | Every booking of the current user |

- Never return another user's bookings.
- Keep ascending booking ID order.
- Reuse the existing query and response mapping. Validation already rejects other values.

## How to work

1. Use the demo account and see the current behavior before you edit code.
2. Run the task test and read the failure:
   `cd backend && npm test -- tests/task-feature.test.js`
3. Make the smallest complete change. Do not change `backend/tests/task-feature.test.js` or the seed data.
4. Run the task test again. Add your own tests for the other values. Then run all tests:
   `cd backend && npm test` and `cd frontend && npm test`
5. Write a short summary: what you changed and your test results.
