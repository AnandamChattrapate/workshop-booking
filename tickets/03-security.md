# Ticket: Changing a booking ID shows another user's booking

**Priority:** High (security)
**Reported by:** Alice Green, a customer
**Time limit:** 45 minutes

## What happened

> I opened my booking and changed the number in the address bar.
> I saw another person's booking, with their name and email.

## Steps to reproduce

1. Start the app (database, backend, frontend) as described in README.md. Open http://localhost:3000.
2. Log in as `alice@example.com` with password `Demo123!`.
3. Open http://localhost:3000/bookings/101. This booking belongs to Alice.
4. Change the URL to http://localhost:3000/bookings/201.
5. Ben Patel's booking appears, including his name and email.

## Expected behavior

- A user can read **only their own** bookings through `GET /api/bookings/:id`.
- For another user's booking, or a booking that does not exist, return
  **404** with the body `{ "error": "Booking not found" }`.
- Users must still be able to read their own bookings.
- Personal booking routes are owner-only, also for administrators.
- Enforce this rule on the **server**. Hiding data in React is not enough.

## How to work

1. Use the demo account and reproduce the problem before you edit code.
2. Run the task test and read the failure:
   `cd backend && npm test -- tests/task-security.test.js`
3. Make the smallest complete fix. Do not change `backend/tests/task-security.test.js` or the seed data.
4. Run the task test again. Add your own tests for related cases. Then run all tests:
   `cd backend && npm test` and `cd frontend && npm test`
5. Write a short summary: the cause, your fix, and your test results.
