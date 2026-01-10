import { NextFunction, Request, Response } from "express";

import db, { ROLES } from "../models";

const { user: User } = db;

const checkDuplicateUsernameOrEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username }).exec();
        if (existingUser) {
            return res.status(400).send({ message: "El username ya esta en uso" });
        }
        const existingEmail = await User.findOne({ email: req.body.email }).exec();
        if (existingEmail) {
            return res.status(400).send({ message: "El email ya esta en uso" });
        }
        return next();
    } catch (err) {
        const message = err instanceof Error ? err.message : err;
        return res.status(500).send({ message });
    }
}

const checkRoleExisted = (req: Request, res: Response, next: NextFunction) => {
  if (Array.isArray(req.body.roles)) {
    for (const element of req.body.roles) {
      if (!ROLES.includes(element)) {
        res.status(401).send({ message: `El Rol ${element} no existe` });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRoleExisted
};

export default verifySignUp;