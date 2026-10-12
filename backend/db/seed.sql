-- Workshop Booking seed data.
-- All demo accounts use the local-only password: Demo123!
-- Dates are fixed so no behavior depends on today's date.

INSERT INTO users (id, name, email, password_hash, role) VALUES
  (1, 'Alice Green', 'alice@example.com', '$2a$10$hp41oU3UqCf699n2JNeZXuRHUxP6rHCo.a2MHWmYp31erVzdVFFV2', 'user'),
  (2, 'Ben Patel',   'ben@example.com',   '$2a$10$hp41oU3UqCf699n2JNeZXuRHUxP6rHCo.a2MHWmYp31erVzdVFFV2', 'user'),
  (3, 'Maya Chen',   'admin@example.com', '$2a$10$hp41oU3UqCf699n2JNeZXuRHUxP6rHCo.a2MHWmYp31erVzdVFFV2', 'admin');

INSERT INTO events (id, title, description, starts_at, location) VALUES
  (1, 'JavaScript Basics', 'Variables, functions, arrays, and objects for new developers.', '2030-06-01T10:00:00Z', 'Hall A'),
  (2, 'React Basics',      'Components, props, state, and effects. Streamed online.',      '2030-06-02T10:00:00Z', NULL),
  (3, 'SQL Basics',        'SELECT, WHERE, JOIN, and GROUP BY with a real database.',      '2030-06-03T10:00:00Z', '   '),
  (4, 'Git Basics',        'Commits, branches, merges, and pull requests.',                '2030-06-04T10:00:00Z', 'Hall B');

-- Practice workshops 01-20 (event ids 5-24), one per day after Git Basics.
INSERT INTO events (id, title, description, starts_at, location)
SELECT
  4 + n,
  'Practice Workshop ' || lpad(n::text, 2, '0'),
  'Hands-on practice session ' || lpad(n::text, 2, '0') || '. Bring a laptop.',
  timestamptz '2030-06-04T10:00:00Z' + make_interval(days => n),
  'Room ' || lpad(n::text, 2, '0')
FROM generate_series(1, 20) AS n;

INSERT INTO bookings (id, user_id, event_id, seats, status, created_at) VALUES
  (101, 1, 1, 1, 'confirmed', '2030-05-01T09:00:00Z'),
  (102, 1, 2, 2, 'cancelled', '2030-05-01T09:05:00Z'),
  (103, 1, 3, 1, 'confirmed', '2030-05-01T09:10:00Z'),
  (201, 2, 1, 1, 'confirmed', '2030-05-02T11:00:00Z'),
  (202, 2, 2, 3, 'confirmed', '2030-05-02T11:05:00Z');
