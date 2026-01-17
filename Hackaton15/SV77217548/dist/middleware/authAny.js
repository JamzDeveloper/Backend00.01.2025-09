"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../utils/tokens");
const requireAuthAny = (req, res, next) => {
    if (req.session && req.session.user) {
        req.auth = { id: req.session.user.id, role: req.session.user.role };
        return next();
    }
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    if (!token) {
        return res.status(401).json({ message: "Autenticacion requerida" });
    }
    try {
        const payload = (0, tokens_1.verifyAccessToken)(token);
        if (!payload.id || typeof payload.id !== "string") {
            return res.status(401).json({ message: "Token invalido" });
        }
        const role = typeof payload.role === "string" ? payload.role : "user";
        req.auth = { id: payload.id, role };
        return next();
    }
    catch (error) {
        return res.status(401).json({ message: "Token invalido" });
    }
};
exports.default = requireAuthAny;
