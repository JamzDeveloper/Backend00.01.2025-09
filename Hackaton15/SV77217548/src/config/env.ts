import * as dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    SESSION_SECRET: process.env.SESSION_SECRET || "",
    DATABASE_URL: process.env.DATABASE_URL || process.env.MONGODB_URI || "",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    ACCESS_TTL: process.env.ACCESS_TTL || "10m",
    REFRESH_TTL: process.env.REFRESH_TTL || "7d",
};

export default env;
