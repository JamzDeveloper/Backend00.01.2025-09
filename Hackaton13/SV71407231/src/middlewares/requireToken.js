export const requireToken = (req, res, next) => {
  if (req.headers["x-token"] !== "secret") {
    return res.status(401).json({ error: "Token inválido o ausente" });
  }
  next();
};