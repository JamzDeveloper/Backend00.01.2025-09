"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeRefreshToken = exports.findRefreshToken = exports.createRefreshToken = void 0;
const refreshToken_model_1 = __importDefault(require("../models/refreshToken.model"));
const createRefreshToken = (payload) => refreshToken_model_1.default.create(payload);
exports.createRefreshToken = createRefreshToken;
const findRefreshToken = (jti) => refreshToken_model_1.default.findOne({ jti });
exports.findRefreshToken = findRefreshToken;
const revokeRefreshToken = (jti) => refreshToken_model_1.default.updateOne({ jti }, { $set: { revoked: true } });
exports.revokeRefreshToken = revokeRefreshToken;
