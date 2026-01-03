const express  = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 8000;
app.set("port",PORT)
const server = require('http').Server(app);
const webSocketServer = require('websocket').server;
const wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

app.use(express.static(path.join(__dirname, './public')))

function originIsAllowed(origin){
    if(origin==="http://localhost:8000")
        return true
    else
        return false

}

wsServer.on("request",(request)=>{
    if(!originIsAllowed(request.origin)){
        request.reject();
        console.log(`${new Date()} conexion rechazada`)
        return;
    }
    const connection = request.accept(null, request.origin);
    connection.on("message",(message)=>{
        console.log(message.utf8Data);
        let objMensaje = JSON.parse(message.utf8Data);
        switch (objMensaje.message) {
            case 'clima':
                console.log(objMensaje)
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://the-weather-api.p.rapidapi.com/api/weather/${objMensaje.query}`,
                    headers: {
                        'X-RapidAPI-Key': '73d70d2c28msh7f79106bce6c25ep19a96ajsn943644966186',
                        'X-RapidAPI-Host': 'the-weather-api.p.rapidapi.com'
                    }
                };
                axios.request(config).then(response=>{
                    console.log(response.data);
                    objMensaje.answer = response.data.data;
                    connection.sendUTF(JSON.stringify(objMensaje))
                })
                break;
        
            default:
                console.log(objMensaje)
                connection.sendUTF(JSON.stringify(objMensaje))
                break;
        }
    })
})

server.listen(PORT, ()=>console.log(`Servidor iniciado en el puerto ${PORT}`))