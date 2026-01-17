import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

function signAccess(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TTL,
  });
}

function signRefresh(payload, jti) {
  return jwt.sign({ ...payload, jti }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TTL,
  });
}
export { signAccess, signRefresh };