import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { signToken } from "../auth.js";

// Returns { token, user } for valid credentials, or null.
export async function login(email, password) {
  const { rows } = await query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
    [email.trim().toLowerCase()]
  );

  const user = rows[0];
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  return {
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
