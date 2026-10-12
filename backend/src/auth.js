import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "local-dev-secret-change-me";
const TOKEN_TTL = "2h";

export function signToken(user) {
  return jwt.sign({ role: user.role, name: user.name }, JWT_SECRET, {
    subject: String(user.id),
    expiresIn: TOKEN_TTL,
  });
}

// Verifies the Bearer token and sets req.user = { id, role, name }.
export function requireAuth(req, res, next) {
  const header = req.get("Authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
      name: payload.name,
    };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  return next();
}
