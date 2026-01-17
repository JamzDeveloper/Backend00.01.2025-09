import { Router } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../services/user.service.js";

import { loginLimiter } from "../config/rateLimit.js";
import { csrfProtection } from "../middleware/csrf.js";
import { requireAuthSession } from "../middleware/authSession.js";

export const router = Router();

router.post("/login",loginLimiter, csrfProtection, async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  req.session.regenerate(err => {
    if (err) return res.status(500).json({ error: "Error de sesión" });

    req.session.user = { id: user.id, role: user.role, email: user.email };
    res.json({ ok: true, mensaje: "Login exitoso" });
  });
});

router.post("/logout",csrfProtection, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ ok: true, mensaje: "Sesión cerrada" });
  });
});
router.get("/me", requireAuthSession, (req, res) => {
  res.json({
    id: req.session.user.id,
    email: req.session.user.email,
    role: req.session.user.role
  });
});