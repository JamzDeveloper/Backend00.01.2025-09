import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import helmet from "helmet";

import { sessionConfig } from "./config/session.js";
import { limiter} from "./config/rate-limit.js";
import { UserRoute } from "./routes/user.routes.js";
import { AuthJwtRoute } from "./routes/authJwt.routes.js";
import { AuthSessionRoute } from "./routes/authSession.routes.js";

class Server {
    constructor() {
        this.app = express();
        this.port = env.PORT;
        this.versionApi = "/api/v1";
        this.userPath = `${this.versionApi}/user`;
        this.sessionPath = `${this.versionApi}/session`;
        this.authJwtPath = `${this.versionApi}/jwt`;

        this.middleware();
        this.routes();
        //this.dbConnection();
    }

    middleware() {
        this.app.set("trust proxy", 1);
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(cookieParser());

        this.app.use(sessionConfig);
        this.app.use(limiter);
    }

    routes() {
        this.app.get(`${this.versionApi}/health`, (req, res) => {
            res.json({ status: "ok" });
        });

        this.app.use(this.userPath, UserRoute);
        this.app.use(this.sessionPath, AuthSessionRoute);
        this.app.use(this.authJwtPath, AuthJwtRoute);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Listening at port ${this.port}`);
        });
    }
}

export { Server as ServerLocal };