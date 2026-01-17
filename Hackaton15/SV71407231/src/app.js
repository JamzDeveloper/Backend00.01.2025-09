import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { sessionConfig } from "./config/session.js";

import { router as sessionRoutes } from "./routes/authSession.routes.js";
import { router as jwtRoutes } from "./routes/authJwt.routes.js";
import { router as privateRoutes } from "./routes/private.routes.js";


import { apiLimiter } from "./config/rateLimit.js";
import cors from "cors";

import { csrfProtection } from "./middleware/csrf.js";


export const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(sessionConfig);

app.use("/session", sessionRoutes);
app.use("/jwt", jwtRoutes);
app.use("/", privateRoutes);

app.use(apiLimiter);
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API en ejecución" });
});

app.get("/session-test", (req, res) => {
  req.session.count = (req.session.count || 0) + 1;
  res.json({ contador: req.session.count });
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});