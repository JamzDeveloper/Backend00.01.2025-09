import "dotenv/config";
import { ServerLocal } from "./src/server.js"

const server01 = new ServerLocal();

server01.listen();