"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const env_1 = __importDefault(require("./env"));
const sessionMiddleware = (0, express_session_1.default)({
    name: "sid",
    secret: env_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env_1.default.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15,
    },
});
exports.default = sessionMiddleware;
