import express from "express";
import cors from "cors";
import { mongoose } from "../config/db.js";
import { UserRoute } from "../routes/user.route.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test";
    this.versionApi = "/api/v1";
    this.userPath = `${this.versionApi}/users`;

    this.middleware();
    this.routes();
    this.dbConnection();
  }

  routes() {
    this.app.get(`${this.versionApi}/health`, (req, res) => {
      res.json({
        status: "ok",
      });
    });
    
    this.app.use(this.userPath, UserRoute);
  }
  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
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
