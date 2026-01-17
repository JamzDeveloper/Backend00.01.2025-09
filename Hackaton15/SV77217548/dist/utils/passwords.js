"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
const hashPassword = (value) => bcryptjs_1.default.hash(value, SALT_ROUNDS);
exports.hashPassword = hashPassword;
const verifyPassword = (value, hash) => bcryptjs_1.default.compare(value, hash);
exports.verifyPassword = verifyPassword;
