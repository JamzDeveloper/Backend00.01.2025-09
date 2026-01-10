"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const role_model_1 = __importDefault(require("./role.model"));
const user_model_1 = __importDefault(require("./user.model"));
exports.ROLES = ["admin", "moderator", "user"];
const init = async () => {
    try {
        const count = await role_model_1.default.estimatedDocumentCount();
        if (count === 0) {
            exports.ROLES.forEach(async (element) => {
                await new role_model_1.default({ name: element }).save();
            });
            console.log("Roles iniciales creados");
        }
    }
    catch (error) {
        console.error("Error al inicializar roles", error);
    }
};
const db = {
    mongoose: mongoose_1.default,
    user: user_model_1.default,
    role: role_model_1.default,
    ROLES: exports.ROLES,
    init,
};
exports.default = db;
