require('dotenv').config();
const express = require("express");
const http = require("http");
const socketIO = require('socket.io');
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.openAIKey
})

const app = express();
const server  = http.createServer(app);

const PORT = process.env.PORT || 8080;

const io = socketIO(server);

io.on("connection",(socket)=>{
    console.log("Nuevo Usuario conectado");
    const historialConversacion = [];
    historialConversacion.push({
        role: "system",
        content: `Eres un chatbot de atencion a estudiantes de fotografia y tu nombre es "chatty", tu mision es dar informacion de lentes
        y configuraciones de camaras para la carrera de fotografia. Tambien debes sugerir tomar los siguientes cursos: 'Fotografia de Moda' y 'Fotografia de Exteriores',
        debes hacer maximo 5 iteraciones con el estudiante para que tome el curso`
    })
    socket.on("disconnect",()=>console.log("Usuario Desconectado"));
    socket.on("sendMessage", async(message, callback)=>{

        try {
            console.log(message)
            historialConversacion.push({role:'user', content: message});
            const respuestaChat = await openai.chat.completions.create({
                model: process.env.openAIModel,
                messages: historialConversacion
            })
            console.log(respuestaChat);
            const respuesta = respuestaChat.choices[0].message?.content;
            historialConversacion.push({
                role: 'assistant',
                content: respuesta
            })
            socket.emit("message", respuesta);
            callback();
        } catch (error) {
            console.error(error)
        }
    })
})

app.use(express.static('public'));

server.listen(PORT,()=>{
    console.log(`Servidor escuchando el puerto ${PORT}`)
})