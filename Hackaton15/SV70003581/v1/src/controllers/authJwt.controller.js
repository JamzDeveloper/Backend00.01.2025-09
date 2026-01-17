/*
    Recibir peticiones HTTP
    Validar superficialmente datos de entrada (existencia, tipo y formato)
    Retornar respuestas HTTP
*/

import jwt from "jsonwebtoken";

import { userService } from "../services/user.service.js";
import { verifyPassword } from "../utils/passwords.js";
import { signAccess, signRefresh } from "../utils/tokens.js";
import { env } from "../config/env.js";


export async function logIn (req, res) {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);
console.log(user)
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
};

export async function refresh(req, res) {
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
};