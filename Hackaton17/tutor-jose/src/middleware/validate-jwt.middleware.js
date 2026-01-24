import { request, response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../services/user.service.js";

export const verifyTokenJwt = (req = request, res = response, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Unauthorized - Invalid token" });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    // consultar a db
    const findUser = findUserById(decoded.id);
    if (!findUser) {
      return res.status(401).json({ msg: "Unauthorized - Invalid token" });
    }

    req.user = findUser;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized - Invalid token" });
  }
};
