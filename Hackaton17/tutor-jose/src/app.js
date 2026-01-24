import "dotenv/config";
import { ServerLocal } from "./server.js";

const server1 = new ServerLocal();

server1.listen();
