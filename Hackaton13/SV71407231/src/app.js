import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";


import { errorHandler } from "./middlewares/errorHandler.js";
import { requireJson } from "./middlewares/requireJson.js";
import { logger } from "./middlewares/logger.js";
import healthRoutes from "./routes/health.routes.js";
import usersRoutes from "./routes/users.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import { metricsMiddleware } from "./middlewares/metrics.js";
import metricsRoutes from "./routes/metrics.routes.js";
import docsRoutes from "./routes/docs.routes.js";


const app = express();


app.use(express.json());



app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(metricsMiddleware);
app.use("/api/docs", docsRoutes);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Demasiadas solicitudes, intenta más tarde"
  })
);

app.use(logger);


app.use("/api", healthRoutes);
app.use(errorHandler);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/uploads", uploadsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/metrics", metricsRoutes);

export default app;