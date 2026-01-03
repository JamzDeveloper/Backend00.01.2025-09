require('dotenv').config();
const  axios  = require('axios');
const express = require("express");
const http = require("http");
const socketIO = require('socket.io');

const app = express();
const server  = http.createServer(app);

const PORT = process.env.PORT || 8080;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL;

const io = socketIO(server);

io.on("connection",(socket)=>{
    console.log("Nuevo Usuario conectado");
    const historialConversacion = [];
    const maxTokens = 1024;
    historialConversacion.push({
        role: "system",
        content: `Eres un chatbot de atencion a estudiantes de fotografia y tu nombre es "deepy", tu mision es dar informacion de lentes
        y configuraciones de camaras para la carrera de fotografia. Tambien debes sugerir tomar los siguientes cursos: 'Fotografia de Moda' y 'Fotografia de Exteriores',
        debes hacer maximo 5 iteraciones con el estudiante para que tome el curso`
    })
    socket.on("disconnect",()=>console.log("Usuario Desconectado"));
    socket.on("sendMessage", async(message, callback)=>{

        try {
            console.log(message)
            historialConversacion.push({role:'user', content: message});
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model : DEEPSEEK_MODEL,
                    messages: historialConversacion,
                    maxTokens
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                    }
                }
            )
            const respuesta = response.data.choices[0].message?.content
            console.log(respuesta)
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