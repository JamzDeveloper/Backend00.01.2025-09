export const requireRole = (...roles) => (req, res, next) => {
  const actor = req.session?.user;
  if (!actor || !roles.includes(actor.role)) {
    return res.sendStatus(403);
  }
  next();
};