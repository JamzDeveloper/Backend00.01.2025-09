console.log('Iniciando Lista de Compras');

require('dotenv').config();
const express = require('express');
const { listaRouter } = require('./lista.router');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get('/', (req,res)=>{
    res.send({
        message: ' API esta lista',
        rutas:{
            "Crear item": "POST /lista",
            "Pendientes": "GET /pendientes",
            "Completados": "GET /completados",
            "Completar item": "PUT /completar/:id"
        }
    })
});

app.use('/lista' , listaRouter);

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log('Listo para la presentacion!');
})