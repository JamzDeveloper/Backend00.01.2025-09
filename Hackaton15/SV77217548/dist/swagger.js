"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("./config/env"));
const port = env_1.default.PORT || 3000;
const host = `localhost:${port}`;
const doc = {
    info: {
        title: "Hackaton15 API",
        version: "1.0.0",
        description: "API de autenticacion con sesion y JWT",
    },
    host,
    schemes: ["http"],
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "Bearer <token>",
        },
        sessionAuth: {
            type: "apiKey",
            in: "cookie",
            name: "sid",
            description: "Cookie de sesion",
        },
        refreshAuth: {
            type: "apiKey",
            in: "cookie",
            name: "refreshToken",
            description: "Cookie de refresh token",
        },
    },
};
const outputFile = path_1.default.join(__dirname, "swagger-output.json");
const endpointsFiles = [path_1.default.join(__dirname, "routes", "*.{ts,js}")];
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
