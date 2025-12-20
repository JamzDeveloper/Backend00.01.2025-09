console.log("Inicio de la aplicacion");

import express = require('express');

const app = express();

app.get("/",(req,res)=>{
    res.send("Hola desde espress")
});

app.post("/",(req,res)=>{
    res.send("Hola desde espress")
});

app.listen(6969,()=>console.log(`escuchando desde el puerto 6969`))