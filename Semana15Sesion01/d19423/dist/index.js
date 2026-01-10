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
console.log("Inicio de la aplicacion");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const compression_1 = __importDefault(require("compression"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const models_1 = __importDefault(require("./models"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const PORT = Number(process.env.PORT) || 8080;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const app = (0, express_1.default)();
app.use((0, cookie_session_1.default)({
    name: "auth-session",
    keys: [COOKIE_SECRET || "dev-secret"],
    httpOnly: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
const limiter = (0, express_rate_limit_1.default)({ windowMs: 60000, max: 100 });
app.use("/api/", limiter);
app.get("/", (_req, res) => {
    res.send("Hola");
});
(0, auth_route_1.default)(app);
(0, user_route_1.default)(app);
const start = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI no está configurado");
        }
        await models_1.default.mongoose.set('strictQuery', true);
        await models_1.default.mongoose.connect(MONGO_URI, {});
        console.log("Estas conectado");
        await models_1.default.init();
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en el puerto ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
