import { Router } from "express";
import { requireAuthSession } from "../middleware/authSession.js";
import { requireRole } from "../middleware/requireRole.js";
import { requireAuthJwt } from "../middleware/authJwt.js";

export const router = Router();

router.get("/me", requireAuthSession, (req, res) => {
  res.json(req.session.user);
});

router.get("/admin/stats", requireAuthSession, requireRole("admin"), (req, res) => {
  res.json({ mensaje: "Estadísticas solo para administradores" });
});

router.get("/jwt/me", requireAuthJwt, (req, res) => {
  res.json(req.user);
});
