export const requireJson = (req, res, next) => {
  if (req.path.startsWith("/uploads")) {
    return next();
  }

  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    !req.is("application/json")
  ) {
    return res.status(415).json({
      error: "El Content-Type debe ser application/json"
    });
  }

  next();
};