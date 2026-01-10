"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = __importDefault(require("../models"));
const { user: User, role: Role } = models_1.default;
const verifyToken = (req, res, next) => {
    const token = req.session?.token;
    if (!token) {
        return res.status(401).send({ message: "No estás enviando el token" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).send({ message: "JWT_SECRET no está configurado" });
    }
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            return res.status(401).send({ message: "Token inválido" });
        }
        req.userId = decoded.id;
        return next();
    });
};
const isModerator = async (req, res, next) => {
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
};
const isAdmin = async (req, res, next) => {
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
};
const authJwt = {
    verifyToken,
    isModerator,
    isAdmin,
};
exports.default = authJwt;
