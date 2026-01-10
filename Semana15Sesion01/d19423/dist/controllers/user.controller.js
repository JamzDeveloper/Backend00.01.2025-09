"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyAdmin = exports.onlyModerator = exports.onlyUser = exports.allAccess = void 0;
const models_1 = __importDefault(require("../models"));
const { user: User } = models_1.default;
const allAccess = (_req, res) => {
    res.status(200).send("Contenido Public");
};
exports.allAccess = allAccess;
const onlyUser = async (_req, res) => {
    const user = await User.findById(_req.userId).exec();
    if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
    }
    res.status(200).send(`Contenido del Usuario ${user.username}`);
};
exports.onlyUser = onlyUser;
const onlyModerator = (_req, res) => {
    res.status(200).send("Contenido del Moderator");
};
exports.onlyModerator = onlyModerator;
const onlyAdmin = (_req, res) => {
    res.status(200).send("Contenido del Admin");
};
exports.onlyAdmin = onlyAdmin;
