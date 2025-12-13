// src/server.js

require('dotenv').config();

const express = require('express');
const { getDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(require("cors")());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send({ message: "online" });
});

app.listen(PORT, async () => {
    try{
        await getDB();        
        console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    }catch(error){
        console.error("❌ Error inicializando la app:", error);
    }
    
});

const { itemRouter } = require('./routes/item.router');
app.use('/api/items', itemRouter);

// Agregado
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'front')));