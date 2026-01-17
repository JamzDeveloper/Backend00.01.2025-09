import { randomUUID } from "crypto";
import { saveMessage } from "../services/chat.service.js";
import { openai } from "../utils/openai.client.js";

export function chatSocketController(io, socket) {

  // ENVIAR MENSAJE
  socket.on("chat event", async (data) => {
    const messageId = randomUUID();

    const messageData = {
      id: messageId,
      username: data.username,
      message: data.message,
    };

    // Guardar mensaje del usuario
    await saveMessage(data.message, data.username);

    // Emitir mensaje normal
    io.emit("response", messageData);

    // Si NO menciona al bot, termina aquí
    if (!data.message.includes("@AgenteIdat")) return;

    // Mensaje temporal del bot
    const typingId = randomUUID();
    socket.emit("response", {
      id: typingId,
      username: "AgenteIdat🤖",
      message: "Estoy trabajando en tu respuesta..."
    });

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: `Eres un chatbot de atención a estudiantes de un instituto tecnológico.
Tu nombre es "AgenteIdat".
Sugieres Backend y Frontend.
Máximo 5 interacciones.`
          },
          { role: "user", content: data.message }
        ]
      });

      const aiMessage = completion.choices[0].message.content;

      await saveMessage(aiMessage, "AgenteIdat🤖");

      io.emit("response", {
        id: randomUUID(),
        username: "AgenteIdat🤖",
        message: aiMessage
      });

    } catch (error) {
      socket.emit("response", {
        id: randomUUID(),
        username: "AgenteIdat🤖",
        message: "Ocurrió un error al generar la respuesta 😥"
      });
    }
  });

  // EDITAR MENSAJE
  socket.on("edit message", async ({ id, message }) => {
    // (Más adelante puedes validar autor aquí)
    io.emit("message edited", { id, message });
  });

  // ELIMINAR MENSAJE
  socket.on("delete message", async ({ id }) => {
    io.emit("message deleted", { id });
  });
}
