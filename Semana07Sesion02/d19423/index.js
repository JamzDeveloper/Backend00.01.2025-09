console.log("Inicio de la aplicacion")

const express = require("express");
const axios = require('axios');
const path = require('path'); // Import the path module

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'pug')

require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    let ciudad = req.query.ciudad;
    let pais = req.query.pais;

    res.send(`Hola desde mi servidor de espress desde la ciudad ${ciudad} - ${pais}`);
})

app.get("/data", (req, res) => {

    res.set('Content-Type', 'text/html');


    let arrData = [1, 3, 5, 7, 9]

    let html = "<ol>";

    arrData.forEach(element => {
        html += `<li>${element}</li>`
    });
    html += "</ol>"



    res.status(200).send(html);
})

app.get("/user", (req, res) => {
    let html = "<div>";
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://randomuser.me/api/',
        headers: {}
    };
    axios.request(config)
        .then((response) => {
            //console.log(JSON.stringify(response.data));

            data = response.data.results[0];
            console.log(data);
            html += `<label>Nombre:</label><input value="${data.name.first}" disabled /> <br>`
            html += `<input value="${data.name.last}" disabled /> <br>`
            html += `<input value="${data.email}" disabled /> <br>`
            html += `<img src="${data.picture.large}" width="200px"/>`

            html += "</div>"
            res.send(html)
        })
        .catch((error) => {
            console.log(error);
        });
})

app.get('/pagina', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.html'));
})

app.get('/pug', (req, res) => {
    res.render('data', { title: 'Hola que tal ', message: 'Como estas' })
})

app.get("/clima", (req, res) => {
    let html = "<div>";
    let ciudad = req.query.ciudad;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://weather-api99.p.rapidapi.com/weather?city=${ciudad}`,
        headers: {
            'x-rapidapi-host': 'weather-api99.p.rapidapi.com',
            'x-rapidapi-key': '73d70d2c28msh7f79106bce6c25ep19a96ajsn943644966186'
        }
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data);
            let data = response.data;
            html += `<label>Temperatura Celsius:</label><input value="${data.main.temp - 273.15}" disabled /> <br>`
            html += "</div>"
            res.send(html)
        })
        .catch((error) => {
            console.log(error);
        });

})

app.post("/", (req, res) => {
    let body = req.body
    console.log(body)
    res.send(body)
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})