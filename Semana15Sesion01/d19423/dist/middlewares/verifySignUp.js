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
const models_1 = __importStar(require("../models"));
const { user: User } = models_1.default;
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username }).exec();
        if (existingUser) {
            return res.status(400).send({ message: "El username ya esta en uso" });
        }
        const existingEmail = await User.findOne({ email: req.body.email }).exec();
        if (existingEmail) {
            return res.status(400).send({ message: "El email ya esta en uso" });
        }
        return next();
    }
    catch (err) {
        const message = err instanceof Error ? err.message : err;
        return res.status(500).send({ message });
    }
};
const checkRoleExisted = (req, res, next) => {
    if (Array.isArray(req.body.roles)) {
        for (const element of req.body.roles) {
            if (!models_1.ROLES.includes(element)) {
                res.status(401).send({ message: `El Rol ${element} no existe` });
                return;
            }
        }
    }
    next();
};
const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRoleExisted
};
exports.default = verifySignUp;
