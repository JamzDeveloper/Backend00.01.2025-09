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
const express_1 = require("express");
const controller = __importStar(require("../controllers/authSession.controller"));
const authSession_1 = __importDefault(require("../middleware/authSession"));
const csrf_1 = __importDefault(require("../middleware/csrf"));
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
router.post("/session/register", rateLimit_1.authLimiter, (req, res) => {
    // #swagger.tags = ["Session"]
    return controller.register(req, res);
});
router.post("/session/login", rateLimit_1.authLimiter, (req, res) => {
    // #swagger.tags = ["Session"]
    return controller.login(req, res);
});
router.get("/csrf", authSession_1.default, csrf_1.default, (req, res) => {
    // #swagger.tags = ["Session"]
    // #swagger.security = [{"sessionAuth": []}]
    return res.json({ csrfToken: req.csrfToken() });
});
router.post("/session/logout", authSession_1.default, csrf_1.default, (req, res) => {
    // #swagger.tags = ["Session"]
    // #swagger.security = [{"sessionAuth": []}]
    // #swagger.parameters["x-csrf-token"] = { in: "header", required: true, type: "string" }
    return controller.logout(req, res);
});
router.get("/me", authSession_1.default, (req, res) => {
    // #swagger.tags = ["Session"]
    // #swagger.security = [{"sessionAuth": []}]
    return controller.me(req, res);
});
exports.default = router;
