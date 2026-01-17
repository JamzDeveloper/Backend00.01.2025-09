"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenExpiresAt = exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const toExpiresIn = (value) => value;
const signAccessToken = (payload) => {
    if (!env_1.default.JWT_ACCESS_SECRET) {
        throw new Error("Falta JWT_ACCESS_SECRET en el archivo .env");
    }
    return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_ACCESS_SECRET, { expiresIn: toExpiresIn(env_1.default.ACCESS_TTL) });
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    if (!env_1.default.JWT_REFRESH_SECRET) {
        throw new Error("Falta JWT_REFRESH_SECRET en el archivo .env");
    }
    return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_REFRESH_SECRET, { expiresIn: toExpiresIn(env_1.default.REFRESH_TTL) });
};
exports.signRefreshToken = signRefreshToken;
const verifyAccessToken = (token) => {
    if (!env_1.default.JWT_ACCESS_SECRET) {
        throw new Error("Falta JWT_ACCESS_SECRET en el archivo .env");
    }
    const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_ACCESS_SECRET);
    if (typeof decoded === "string") {
        throw new Error("Token invalido");
    }
    return decoded;
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    if (!env_1.default.JWT_REFRESH_SECRET) {
        throw new Error("Falta JWT_REFRESH_SECRET en el archivo .env");
    }
    const decoded = jsonwebtoken_1.default.verify(token, env_1.default.JWT_REFRESH_SECRET);
    if (typeof decoded === "string") {
        throw new Error("Token invalido");
    }
    return decoded;
};
exports.verifyRefreshToken = verifyRefreshToken;
const getTokenExpiresAt = (token) => {
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded || !decoded.exp) {
        return null;
    }
    return new Date(decoded.exp * 1000);
};
exports.getTokenExpiresAt = getTokenExpiresAt;
