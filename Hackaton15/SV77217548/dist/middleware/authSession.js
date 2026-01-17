"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAuthSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "No hay sesion activa" });
    }
    return next();
};
exports.default = requireAuthSession;
