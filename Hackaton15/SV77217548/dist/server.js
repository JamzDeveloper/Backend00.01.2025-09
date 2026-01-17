"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const db_1 = __importDefault(require("./db"));
const start = async () => {
    try {
        if (!env_1.default.DATABASE_URL) {
            throw new Error("Falta DATABASE_URL en el archivo .env");
        }
        if (!env_1.default.SESSION_SECRET) {
            throw new Error("Falta SESSION_SECRET en el archivo .env");
        }
        await (0, db_1.default)(env_1.default.DATABASE_URL);
        app_1.default.listen(env_1.default.PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${env_1.default.PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
