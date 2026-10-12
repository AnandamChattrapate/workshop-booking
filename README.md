# Workshop Booking

A small app where users browse workshops, book seats, and cancel bookings.
Administrators see booking counts for every workshop.

Open tickets are in the [tickets/](tickets/) folder.

## Project structure

| Part | Folder | How it runs | Port |
|---|---|---|---|
| Frontend | `frontend/` | `npm run dev` (Vite). Forwards `/api` to the backend. | 3000 |
| Backend | `backend/` | `npm run dev` (Express) | 4000 |
| Database | – | Docker (`docker compose up`) | 5433 |

## Prerequisites

- Node.js 22
- Docker Desktop (for PostgreSQL only)

## Start the app

Use three terminals, all from the project folder.

**Terminal 1: database**

```bash
docker compose up
```

**Terminal 2: backend** (first start creates the tables and demo data)

```bash
cd backend && npm install && npm run dev
```

**Terminal 3: frontend**

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:3000. Backend and React code reload automatically when you save a file.

If a port is busy on your machine:

- Database: `DB_PORT=5434 docker compose up`, then start the backend with
  `DATABASE_URL=postgres://postgres:postgres@localhost:5434/workshop npm run dev`.
- Backend: `PORT=4100 npm run dev`, then start the frontend with `API_URL=http://localhost:4100 npm run dev`.
- Frontend: `npm run dev -- --port 3100`.

## Run the tests

The database must be running (`docker compose up`).

```bash
cd backend && npm test
```

```bash
cd frontend && npm test
```

Run one test file:

```bash
cd backend && npm test -- tests/api.test.js
```

Backend tests use a separate database (`workshop_test`). They reset it before every test.
If you changed the database port, also set
`TEST_DATABASE_URL=postgres://postgres:postgres@localhost:5434/workshop_test`.

To reset your dev data:

```bash
cd backend && npm run db:reset
```

## Optional: run everything in Docker

```bash
docker compose --profile full up --build
```

Then run tests with `docker compose exec backend npm test` and `docker compose exec frontend npm test`.

## Demo accounts

All accounts use the password `Demo123!`.

| Name | Email | Role |
|---|---|---|
| Alice Green | alice@example.com | user |
| Ben Patel | ben@example.com | user |
| Maya Chen | admin@example.com | admin |

## Demo bookings

| ID | Owner | Workshop | Seats | Status |
|---|---|---|---|---|
| 101 | Alice | JavaScript Basics | 1 | confirmed |
| 102 | Alice | React Basics | 2 | cancelled |
| 103 | Alice | SQL Basics | 1 | confirmed |
| 201 | Ben | JavaScript Basics | 1 | confirmed |
| 202 | Ben | React Basics | 3 | confirmed |

## File map

```
backend/
  src/
    index.js               starts the API server
    app.js                 Express app and error handling
    routes.js              all API routes
    auth.js                JWT sign/verify, requireAuth, requireAdmin
    db.js                  PostgreSQL pool, query(), reset helpers
    controllers/           HTTP input validation and responses
    services/              business rules and SQL
  db/
    schema.sql, seed.sql   tables and demo data
  tests/
    api.test.js            API tests
    helpers.js             test helpers: getAs("alice", path), postAs(...)
frontend/
  src/
    api.js                 fetch wrapper and session storage
    App.jsx                routes and navigation
    pages/                 one file per page
  tests/
    ui.test.jsx            React tests
```

Request flow: `React page → frontend/src/api.js → backend routes.js → controller → service → PostgreSQL`.

## API

| Method | Path | Notes |
|---|---|---|
| POST | /api/auth/login | `{ email, password }` → `{ token, user }` |
| GET | /api/events | All events |
| GET | /api/events/:id | One event with `locationLabel` |
| GET | /api/bookings?status= | Own bookings. `status`: all, confirmed, cancelled |
| GET | /api/bookings/summary | `{ confirmedSeats }` for the logged-in user |
| GET | /api/bookings/:id | One own booking |
| POST | /api/bookings | `{ eventId, seats }` → new confirmed booking |
| POST | /api/bookings/:id/cancel | Cancel an own booking |
| GET | /api/admin/events | Admin only. Events with `confirmedBookings` |

All requests except login need the header `Authorization: Bearer <token>`.
