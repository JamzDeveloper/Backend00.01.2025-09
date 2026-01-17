import { verifyAccess } from "../utils/tokens.js";

export function requireAuthJwt(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return res.sendStatus(401);
  const token = h.slice(7);
  try {
    req.user = verifyAccess(token);
    next();
  } catch {
    res.sendStatus(401);
  }
}
