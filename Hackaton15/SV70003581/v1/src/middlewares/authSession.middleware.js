import { request, response } from "express";

export const requireAuthSession = (req = request, res = response, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ msg: "Unauthorized - No active session" });
  }

  //   if(req.session.user.role!='admin'){}
  next();
};