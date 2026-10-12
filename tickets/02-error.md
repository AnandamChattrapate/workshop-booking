# Ticket: An online workshop page shows an error

**Priority:** High
**Reported by:** Alice Green, a customer
**Time limit:** 45 minutes

## What happened

> I clicked React Basics and the page said "Could not load this event".
> Other workshops open fine.

## Steps to reproduce

1. Start the app (database, backend, frontend) as described in README.md. Open http://localhost:3000.
2. Log in as `alice@example.com` with password `Demo123!`.
3. On the Workshops page, open **React Basics** (event 2).
4. The page shows an error. The request `GET /api/events/2` returns **500**.
   The backend terminal shows the error and stack trace.

## Expected behavior

- The event page loads, and the location shows **Online**.
- A location that is `null`, empty, or only spaces means **Online**.
- For a physical location, remove spaces at the start and end (`"  Hall A  "` → `"Hall A"`).
- Keep all other event fields unchanged.
- Do not delete or edit the event data to hide the error.

## How to work

1. Use the demo account and reproduce the problem before you edit code.
2. Run the task test and read the failure:
   `cd backend && npm test -- tests/task-error.test.js`
3. Make the smallest complete fix. Do not change `backend/tests/task-error.test.js` or the seed data.
4. Run the task test again. Add your own tests for related cases. Then run all tests:
   `cd backend && npm test` and `cd frontend && npm test`
5. Write a short summary: the cause, your fix, and your test results.
