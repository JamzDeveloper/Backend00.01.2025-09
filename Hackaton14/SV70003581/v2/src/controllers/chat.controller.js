import { saveMessage } from "../services/chat.service.js";
import { openai } from "../utils/openai.client.js";

export function chatSocketController(io, socket) {
  socket.on("chat event", async (data) => {
    await saveMessage(data.message, data.username);

    if (!data.message.includes("@AgenteIdat")) {
      return io.emit("response", data);
    }

    socket.emit("response", {
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
        username: "AgenteIdat🤖",
        message: aiMessage
      });
    } catch (error) {
      socket.emit("response", {
        username: "AgenteIdat🤖",
        message: "Ocurrió un error al generar la respuesta 😥"
      });
    }
  });
}
