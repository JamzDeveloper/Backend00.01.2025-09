"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authSession_1 = __importDefault(require("../middleware/authSession"));
const authAny_1 = __importDefault(require("../middleware/authAny"));
const requireRole_1 = __importDefault(require("../middleware/requireRole"));
const router = (0, express_1.Router)();
router.get("/private/profile", authSession_1.default, (req, res) => {
    // #swagger.tags = ["Private"]
    // #swagger.security = [{"sessionAuth": []}]
    res.json({ user: req.session.user });
});
router.get("/admin/stats", authAny_1.default, (0, requireRole_1.default)("admin"), (_req, res) => {
    // #swagger.tags = ["Admin"]
    // #swagger.security = [{"sessionAuth": []}, {"bearerAuth": []}]
    res.json({ ok: true, message: "Acceso permitido a admin" });
});
exports.default = router;
