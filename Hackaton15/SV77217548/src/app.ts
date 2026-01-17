import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import env from "./config/env";
import sessionMiddleware from "./config/session";
import authSessionRoutes from "./routes/authSession.routes";
import authJwtRoutes from "./routes/authJwt.routes";
import privateRoutes from "./routes/private.routes";
import errorHandler from "./middleware/errorHandler";
import {apiLimiter} from "./middleware/rateLimit";

const app = express();

app.set("trust proxy", 1);

const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(helmet());
app.use(cors({origin: corsOrigins, credentials: true}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(apiLimiter);

app.get("/", (_req, res) => {
    res.json({ok: true});
});

app.use(authSessionRoutes);
app.use(authJwtRoutes);
app.use(privateRoutes);

const swaggerPath = path.join(process.cwd(), "src", "swagger-output.json");
let swaggerDocument: Record<string, unknown> = {};
try {
    const swaggerRaw = fs.readFileSync(swaggerPath, "utf8");
    swaggerDocument = JSON.parse(swaggerRaw) as Record<string, unknown>;
} catch (error) {
    swaggerDocument = {
        swagger: "2.0",
        info: {
            title: "Hackaton15 API",
            version: "1.0.0",
            description: "API de autenticacion con sesion y JWT",
        },
        paths: {},
    };
}

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
            withCredentials: true,
        },
    })
);

app.use(errorHandler);

export default app;
