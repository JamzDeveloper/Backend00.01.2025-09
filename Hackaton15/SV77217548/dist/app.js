"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("./config/env"));
const session_1 = __importDefault(require("./config/session"));
const authSession_routes_1 = __importDefault(require("./routes/authSession.routes"));
const authJwt_routes_1 = __importDefault(require("./routes/authJwt.routes"));
const private_routes_1 = __importDefault(require("./routes/private.routes"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const rateLimit_1 = require("./middleware/rateLimit");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
const corsOrigins = env_1.default.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: corsOrigins, credentials: true }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(session_1.default);
app.use(rateLimit_1.apiLimiter);
app.get("/", (_req, res) => {
    res.json({ ok: true });
});
app.use(authSession_routes_1.default);
app.use(authJwt_routes_1.default);
app.use(private_routes_1.default);
const swaggerPath = path_1.default.join(process.cwd(), "src", "swagger-output.json");
let swaggerDocument = {};
try {
    const swaggerRaw = fs_1.default.readFileSync(swaggerPath, "utf8");
    swaggerDocument = JSON.parse(swaggerRaw);
}
catch (error) {
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
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument, {
    swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
    },
}));
app.use(errorHandler_1.default);
exports.default = app;
