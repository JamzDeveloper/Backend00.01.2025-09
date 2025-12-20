"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Inicio de la aplicacion");
var express = require("express");
var app = express();
app.get("/", function (req, res) {
    res.send("Hola desde espress");
});
app.post("/", function (req, res) {
    res.send("Hola desde espress");
});
app.listen(6969, function () { return console.log("escuchando desde el puerto 6969"); });
