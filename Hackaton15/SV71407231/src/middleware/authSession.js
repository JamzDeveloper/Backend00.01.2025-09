export function requireAuthSession(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  next();
}