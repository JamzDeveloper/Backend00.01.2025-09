"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = exports.register = void 0;
const userService = __importStar(require("../services/user.service"));
const passwords_1 = require("../utils/passwords");
const allowedRoles = new Set(["user", "admin", "moderator"]);
const register = async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const rawRole = typeof req.body.role === "string" ? req.body.role.trim() : "";
    if (!email || !password) {
        return res.status(400).json({ message: "Email y password son requeridos" });
    }
    const existing = await userService.findUserByEmail(email);
    if (existing) {
        return res.status(400).json({ message: "El email ya esta en uso" });
    }
    const role = allowedRoles.has(rawRole) ? rawRole : "user";
    const passwordHash = await (0, passwords_1.hashPassword)(password);
    const user = await userService.createUser({ email, passwordHash, role });
    return res.status(201).json({ id: user.id, email: user.email, role: user.role });
};
exports.register = register;
const login = async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!email || !password) {
        return res.status(400).json({ message: "Email y password son requeridos" });
    }
    const user = await userService.findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }
    const valid = await (0, passwords_1.verifyPassword)(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }
    return req.session.regenerate((err) => {
        if (err) {
            return res.status(500).json({ message: "Error al crear la sesion" });
        }
        req.session.user = { id: user.id, email: user.email, role: user.role };
        return res.status(200).json({ ok: true });
    });
};
exports.login = login;
const logout = (req, res) => {
    return req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesion" });
        }
        res.clearCookie("sid");
        return res.status(200).json({ message: "Sesion cerrada" });
    });
};
exports.logout = logout;
const me = (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "No hay sesion activa" });
    }
    return res.json({ user: req.session.user });
};
exports.me = me;
