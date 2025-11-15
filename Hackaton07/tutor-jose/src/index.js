require("dotenv").config();

const { Server } = require("./server");

const server1 = new Server();

server1.listen();
