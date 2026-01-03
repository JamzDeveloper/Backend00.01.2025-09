import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

//escucha una conexion
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat event", (data) => {
    console.log("message: ", data);
    //TODO: gurdar en la db los mensajes

    if (data.message.includes("@AgenteIdat")) {
      io.emit("response", data);

      //TODO: Peticion a openIa o DEEPSEEK  para obtener respuesta

      data.message = "Estoy Trabajando en tu respuesta......";
      data.username = "AgenteIdat🤖";
    }

    io.emit("response", data);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
