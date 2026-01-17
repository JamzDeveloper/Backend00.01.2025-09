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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.refresh = exports.login = void 0;
const crypto_1 = require("crypto");
const env_1 = __importDefault(require("../config/env"));
const userService = __importStar(require("../services/user.service"));
const refreshTokenService = __importStar(require("../services/refreshToken.service"));
const passwords_1 = require("../utils/passwords");
const tokens_1 = require("../utils/tokens");
const buildRefreshCookieOptions = (expiresAt) => {
    const options = {
        httpOnly: true,
        sameSite: "lax",
        secure: env_1.default.NODE_ENV === "production",
    };
    if (expiresAt) {
        options.expires = expiresAt;
    }
    return options;
};
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
    try {
        const accessToken = (0, tokens_1.signAccessToken)({ id: user.id, role: user.role });
        const jti = (0, crypto_1.randomUUID)();
        const refreshToken = (0, tokens_1.signRefreshToken)({ id: user.id, jti });
        const expiresAt = (0, tokens_1.getTokenExpiresAt)(refreshToken) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await refreshTokenService.createRefreshToken({ userId: user._id, jti, expiresAt });
        res.cookie("refreshToken", refreshToken, buildRefreshCookieOptions(expiresAt));
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        return res.status(500).json({ message: "JWT no configurado" });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "Refresh token requerido" });
    }
    try {
        const payload = (0, tokens_1.verifyRefreshToken)(token);
        const jti = typeof payload.jti === "string" ? payload.jti : "";
        const userId = typeof payload.id === "string" ? payload.id : "";
        if (!jti || !userId) {
            return res.status(401).json({ message: "Refresh token invalido" });
        }
        const stored = await refreshTokenService.findRefreshToken(jti);
        if (!stored || stored.revoked) {
            return res.status(401).json({ message: "Refresh token invalido" });
        }
        if (stored.expiresAt < new Date()) {
            return res.status(401).json({ message: "Refresh token expirado" });
        }
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
        await refreshTokenService.revokeRefreshToken(jti);
        const newJti = (0, crypto_1.randomUUID)();
        const newRefreshToken = (0, tokens_1.signRefreshToken)({ id: user.id, jti: newJti });
        const newExpiresAt = (0, tokens_1.getTokenExpiresAt)(newRefreshToken) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await refreshTokenService.createRefreshToken({ userId: user._id, jti: newJti, expiresAt: newExpiresAt });
        const accessToken = (0, tokens_1.signAccessToken)({ id: user.id, role: user.role });
        res.cookie("refreshToken", newRefreshToken, buildRefreshCookieOptions(newExpiresAt));
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        return res.status(401).json({ message: "Refresh token invalido" });
    }
};
exports.refresh = refresh;
const logout = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (token) {
        try {
            const payload = (0, tokens_1.verifyRefreshToken)(token);
            const jti = typeof payload.jti === "string" ? payload.jti : "";
            if (jti) {
                await refreshTokenService.revokeRefreshToken(jti);
            }
        }
        catch (error) {
            // Token invalido, se limpia la cookie igual.
        }
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Sesion JWT cerrada" });
};
exports.logout = logout;
const me = async (req, res) => {
    if (!req.auth) {
        return res.status(401).json({ message: "Token requerido" });
    }
    const user = await userService.findUserById(req.auth.id);
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json({ id: user.id, email: user.email, role: user.role });
};
exports.me = me;
