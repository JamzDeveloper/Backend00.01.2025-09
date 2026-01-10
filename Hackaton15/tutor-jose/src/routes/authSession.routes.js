import { Router } from "express";
import { findUserByEmail } from "../services/user.service.js";
import { verifyPassword } from "../utils/passwords.js";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);

  console.log("users", user);

  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "Session error" });

    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({ user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout error" });

    res.clearCookie("sid");
    res.json({ ok: true });
  });
});

export { router as AuthSessionRoute };
