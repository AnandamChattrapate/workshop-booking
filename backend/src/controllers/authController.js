import * as authService from "../services/authService.js";

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const result = await authService.login(email, password);
  if (!result) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  return res.json(result);
}
