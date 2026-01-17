import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

//My TODO didit START!
import mongoose from "mongoose";
import { MessageModel } from "./message.model.js"
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

async function dbconnection() {
  await mongoose.connect(process.env.URL_MONGO);
  console.log("mongodb connected.")
}
dbconnection();
async function saveMessage(message, user) {
  const existUser = await MessageModel.findOne({ user });
  const now = new Date();
  if (!existUser) {
    await MessageModel.create({
      history: message,
      user: user,
      datetime: now
    });
  } else {
    await MessageModel.updateOne(
      { user },
      { $push: { history: message, datetime: now } }
    );
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


//My TODO didit END!

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

    //TODO OK: gurdar en la db los mensajes 
    saveMessage(data.message, data.username);


    if (data.message.includes("@AgenteIdat")) {

      // Aviso inmediato al cliente
      socket.emit("response", {
        username: "AgenteIdat🤖",
        message: "Estoy trabajando en tu respuesta..."
      });

      // Llamada a OpenAI
      (async () => {
        try {
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
              {
                role: "system",
                content: `Eres un chatbot de atención a estudiantes de un instituto técnológico.
Tu nombre es "AgenteIdat".
Das información sobre cursos y carreras técnicas.
Sugieres los cursos "Backend" y "Frontend" en primera instancia.
Máximo 5 interacciones por estudiante.`
              },
              {
                role: "user",
                content: data.message
              }
            ]
          });

          const aiMessage = completion.choices[0].message.content;

          // Guardar respuesta del bot
          await saveMessage(aiMessage, "AgenteIdat🤖");

          // Enviar respuesta al cliente
          io.emit("response", {
            username: "AgenteIdat🤖",
            message: aiMessage
          });

        } catch (error) {
          console.error("Error OpenAI:", error);

          socket.emit("response", {
            username: "AgenteIdat🤖",
            message: "Ocurrió un error al generar la respuesta 😥"
          });
        }
      })();
    }


    io.emit("response", data);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
