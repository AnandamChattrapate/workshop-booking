-- Workshop Booking schema.
-- Drops and recreates every table so a reset always starts clean.

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            integer PRIMARY KEY,
  name          text NOT NULL,
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('user', 'admin'))
);

CREATE TABLE events (
  id          integer PRIMARY KEY,
  title       text NOT NULL,
  description text NOT NULL,
  starts_at   timestamptz NOT NULL,
  location    text NULL
);

CREATE SEQUENCE bookings_id_seq START WITH 1000;

CREATE TABLE bookings (
  id         integer PRIMARY KEY DEFAULT nextval('bookings_id_seq'),
  user_id    integer NOT NULL REFERENCES users(id),
  event_id   integer NOT NULL REFERENCES events(id),
  seats      integer NOT NULL CHECK (seats BETWEEN 1 AND 6),
  status     text NOT NULL CHECK (status IN ('confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER SEQUENCE bookings_id_seq OWNED BY bookings.id;

CREATE INDEX bookings_user_id_idx ON bookings (user_id);
CREATE INDEX bookings_event_id_idx ON bookings (event_id);
