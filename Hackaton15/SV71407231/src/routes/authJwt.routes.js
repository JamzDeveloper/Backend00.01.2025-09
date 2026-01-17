import { Router } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../services/user.service.js";
import { signAccess, signRefresh, verifyRefresh, newJti } from "../utils/tokens.js";
import { saveRefresh, getRefresh, revokeRefresh, revokeAllForUser } from "../services/token.service.js";

import { loginLimiter } from "../config/rateLimit.js";

export const router = Router();

router.post("/login",loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.sendStatus(401);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.sendStatus(401);

  const access = signAccess({ id: user.id, role: user.role, email: user.email });
  const jti = newJti();
  const refresh = signRefresh({ id: user.id }, jti);

  saveRefresh(jti, { userId: user.id });

  res
    .cookie("refreshToken", refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })
    .json({ access });
});

router.post("/refresh", (req, res) => {
  const rt = req.cookies.refreshToken;
  if (!rt) return res.sendStatus(401);

  try {
    const payload = verifyRefresh(rt);
    const saved = getRefresh(payload.jti);
    if (!saved || saved.revoked) return res.sendStatus(401);

    revokeRefresh(payload.jti);

    const jti = newJti();
    const access = signAccess({ id: payload.id });
    const refresh = signRefresh({ id: payload.id }, jti);
    saveRefresh(jti, { userId: payload.id });

    res
      .cookie("refreshToken", refresh, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      })
      .json({ access });
  } catch {
    res.sendStatus(401);
  }
});

router.post("/logout", (req, res) => {
  const rt = req.cookies.refreshToken;
  if (rt) {
    try {
      const payload = verifyRefresh(rt);
      revokeAllForUser(payload.id);
    } catch {}
  }
  res.clearCookie("refreshToken").json({ ok: true });
});
