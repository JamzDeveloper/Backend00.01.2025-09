import express from "express";

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import { mongoose } from "../config/db.js";
import { metricsMiddleware } from "../middlewares/metric.middleware.js";
import { logger } from "../middlewares/metric.middleware.js"
import { limiter } from "../middlewares/rateLimit.middleware.js";

import { UserRoute } from "../routes/user.route.js";
import { OrderRoute } from "../routes/order.route.js"
import { MetricRoute } from "../routes/metric.route.js"

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test";
    this.versionApi = "/api/v1";
    this.userPath = `${this.versionApi}/users`;
    this.orderPath = `${this.versionApi}/orders`;
    this.metricPath = `${this.versionApi}/metrics`;

    this.middleware();
    this.routes();
    this.dbConnection();
  }

  middleware() {    
    this.app.use(compression());
    this.app.use(cors());    
    this.app.use(limiter);
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(metricsMiddleware);
    this.app.use(logger);
  }

  routes() {
    this.app.get(`${this.versionApi}/health`, (req, res) => {
      res.json({
        status: "ok",
      });
    });
    this.app.use(this.userPath, UserRoute);
    this.app.use(this.orderPath, OrderRoute);
    this.app.use(this.metricPath, MetricRoute);
  }

  async dbConnection() {
    await mongoose.connect(this.mongoUrl);
    console.log("MongoDb connected");
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`listening in port ${this.port}`);
    });
  }
}

export { Server as ServerLocal };
