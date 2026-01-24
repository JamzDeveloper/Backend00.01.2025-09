import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Server as ServerSocket } from "socket.io";

import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import { sessionConfig } from "./config/session.js";
import { AuthSessionRoute } from "./routes/authSession.routes.js";
import { UserRoute } from "./routes/users.route.js";
import { AuthJwtRoute } from "./routes/authJwt.routes.js";
import { limiter } from "./config/rate-limit.js";

// import { mongoose } from "../config/db.js";
//TODO: encriptar contraseña
//TODO: agregar base de datos
const __dirname = dirname(fileURLToPath(import.meta.url));

class Server {
  constructor() {
    this.app = express();
    this.port = env.PORT;
    this.server = createServer(this.app);
    this.io = new ServerSocket(this.server);
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
    this.app.use(express.static(join(__dirname, "public")));

    this.app.set("trust proxy", 1);
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "ws:", "wss:"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
          },
        },
      }),
    );
    this.app.use(cookieParser());

    this.app.use(sessionConfig);
    this.app.use(limiter);
    this.initSocket();
  }

  routes() {
    this.app.get("/", (req, res) => {
      res.sendFile(join(__dirname, "/public", "index.html"));
    });

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

  async initSocket() {
    //escucha una conexion
    this.io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });

      socket.on("chat event", (data) => {
        console.log("message: ", data);
        //TODO: gurdar en la db los mensajes

        if (data.message.includes("@AgenteIdat")) {
          this.io.emit("response", data);

          //TODO: Peticion a openIa o DEEPSEEK  para obtener respuesta

          data.message = "Estoy Trabajando en tu respuesta......";
          data.username = "AgenteIdat🤖";
        }

        this.io.emit("response", data);
      });
    });
  }
  listen() {
    this.server.listen(this.port, () => {
      console.log(`listening in port ${this.port}`);
    });
  }
}

export { Server as ServerLocal };
