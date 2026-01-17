"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, _req, res, _next) => {
    if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });
        return;
    }
    if (err.name === "CastError") {
        res.status(400).json({ message: "Id invalido" });
        return;
    }
    const anyError = err;
    if (anyError.code === 11000) {
        res.status(400).json({ message: "Dato duplicado" });
        return;
    }
    res.status(500).json({ message: "Error inesperado" });
};
exports.default = errorHandler;
