import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "../models/Message.js";
import OpenAI from "openai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

io.on("connection", async (socket) => {
  console.log("Usuario conectado:", socket.id);

  const messages = await Message.find()
    .sort({ createdAt: 1 })
    .limit(50);

  socket.emit("chat-history", messages);

  socket.on("chat event", async (data) => {
    const text = data.message.trim();
    if (!text) return;

    if (text === "/clear") {
      await Message.deleteMany({});
      io.emit("chat-cleared");
      return;
    }

    if (text.startsWith("/bot")) {
      const userMessage = await Message.create({
        username: data.username,
        message: text
      });

      io.emit("response", userMessage);

      const prompt = text.replace("/bot", "").trim();

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: "Eres un asistente breve y claro." },
            { role: "user", content: prompt }
          ]
        });

        const botMessage = await Message.create({
          username: "Bot",
          message: completion.choices[0].message.content
        });

        io.emit("response", botMessage);
      } catch (error) {
        console.error("Error OpenAI:", error.message);
      }

      return;
    }

    const newMessage = await Message.create({
      username: data.username,
      message: text
    });

    io.emit("response", newMessage);
  });

  socket.on("edit-message", async ({ id, message }) => {
    const updated = await Message.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );
    io.emit("message-edited", updated);
  });

  socket.on("delete-message", async (id) => {
    await Message.findByIdAndDelete(id);
    io.emit("message-deleted", id);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

const PORT = 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
