"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireRole = (...roles) => (req, res, next) => {
    const role = req.session?.user?.role || req.auth?.role;
    if (!role) {
        return res.status(401).json({ message: "Autenticacion requerida" });
    }
    if (!roles.includes(role)) {
        return res.status(403).json({ message: "No tienes permisos" });
    }
    return next();
};
exports.default = requireRole;
