import { Router } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/user.service.js";
import { verifyPassword } from "../utils/passwords.js";
import { signAccess, signRefresh } from "../utils/tokens.js";
import { env } from "../config/env.js";

const router = Router();
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);

  console.log("users", user);

  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const tokens = {
    access: signAccess({ id: user.id, email: user.email, role: user.role }),
    refresh: signRefresh({ id: user.id, email: user.email, role: user.role }),
  };

  delete user.password;
  res.json({
    user: user,
    tokens: tokens,
  });
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    //validar el refresh token
    console.log("refreshToken", refreshToken);

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    console.log("decode", decoded);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized - Invalid token" });
    }

    //generar nuevos tokens
    const tokens = {
      access: signAccess({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }),
      refresh: signRefresh({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }),
    };

    //responder con los nuevos tokens
    res.json({
      tokens: tokens,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(401).json({ msg: "Unauthorized - Invalid token" });
  }
});

export { router as AuthJwtRoute };
