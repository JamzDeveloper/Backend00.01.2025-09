"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csurf_1 = __importDefault(require("csurf"));
const env_1 = __importDefault(require("../config/env"));
const csrfProtection = (0, csurf_1.default)({
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env_1.default.NODE_ENV === "production",
    },
});
exports.default = csrfProtection;
