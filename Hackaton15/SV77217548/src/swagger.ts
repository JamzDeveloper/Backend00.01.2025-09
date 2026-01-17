import swaggerAutogen from "swagger-autogen";
import path from "path";
import env from "./config/env";

const port = env.PORT || 3000;
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

const outputFile = path.join(__dirname, "swagger-output.json");
const endpointsFiles = [path.join(__dirname, "routes", "*.{ts,js}")];

swaggerAutogen()(outputFile, endpointsFiles, doc);
