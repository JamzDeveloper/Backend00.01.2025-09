import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../models";

const { user: User, role: Role } = db;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.session?.token as string | undefined;
    if (!token) {
        return res.status(401).send({ message: "No estás enviando el token" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).send({ message: "JWT_SECRET no está configurado" });
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            return res.status(401).send({ message: "Token inválido" });
        }
        req.userId = (decoded as jwt.JwtPayload).id as string;
        return next();
    });
}

const isModerator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).send({ message: "Token no encontrado" });
        }
        const user = await User.findById(req.userId).exec();
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        const roles = await Role.find({ _id: { $in: user.roles } }).exec();
        const hasModerator = roles.some((r) => r.name === "moderator");
        if (hasModerator) {
            return next();
        }
        return res.status(403).send({ message: "Se requiere el rol de Moderator" });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Error en validación de rol";
        return res.status(500).send({ message });
    }
}

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(401).send({ message: "Token no encontrado" });
        }
        const user = await User.findById(req.userId).exec();
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        const roles = await Role.find({ _id: { $in: user.roles } }).exec();
        const hasAdmin = roles.some((r) => r.name === "admin");
        if (hasAdmin) {
            return next();
        }
        return res.status(403).send({ message: "Se requiere el rol de Administrador" });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Error en validación de rol";
        return res.status(500).send({ message });
    }
}

const authJwt = {
  verifyToken,
  isModerator,
  isAdmin,
};

export default authJwt;
