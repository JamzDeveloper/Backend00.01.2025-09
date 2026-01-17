import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { sessionConfig } from "./config/session.js";
import { AuthSessionRoute } from "./routes/authSession.routes.js";
import { UserRoute } from "./routes/users.route.js";
import { AuthJwtRoute } from "./routes/authJwt.routes.js";
import {limiter} from "./config/rate-limit.js"
// import { mongoose } from "../config/db.js";
class Server {
  constructor() {
    this.app = express();
    this.port = env.PORT;
    // this.mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test";
    this.versionApi = "/api/v1";
    this.sessionPath = `${this.versionApi}/session`;
    this.usersPath = `${this.versionApi}/users`;
    this.authJwtPath = `${this.versionApi}/jwt`;

    this.middleware();
    this.routes();
    this.dbConnection();
  }

  middleware() {
    this.app.set("trust proxy", 1);
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(cookieParser());

    this.app.use(sessionConfig);
    this.app.use(limiter)

  }

  routes() {
    this.app.get(`${this.versionApi}/health`, (req, res) => {
      res.json({
        status: "ok",
      });
    });

    this.app.use(this.sessionPath, AuthSessionRoute);

    this.app.use(this.usersPath, UserRoute);

    this.app.use(this.authJwtPath, AuthJwtRoute);
  }

  async dbConnection() {
    // await mongoose.connect(this.mongoUrl);
    // console.log("MongoDb connected");
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`listening in port ${this.port}`);
    });
  }
}

export { Server as ServerLocal };
