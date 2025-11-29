const express = require("express");
const axios = require("axios");

class Server {
  originPath = "/api";
  githubPath = "/github";
  marsPath = "/mars";
  climaPath = "/clima";

  constructor() {
    this.port = process.env.PORT || 4000;
    this.githubApi = process.env.GITHUB_API;
    this.nasaApi = process.env.NASA_API;
    this.nasaApiKey = process.env.NASA_API_KEY;
    this.app = express();

    this.routes();

    // this.dbConnection();
    // this.dbConnection();
  }

  routes() {
    this.app.get(`${this.originPath}/ok`, (req, res) => {
      res.json({
        success: true,
        message: "Todo bien",
      });
    });

    this.app.get(
      `${this.originPath}${this.githubPath}/:username`,
      async (req, res) => {
        const params = req.params;
        console.log("params", params);

        if (!params.username.trim()) {
          return res.status(400).json({
            code: "BAD_REQUEST",
            statusCode: 400,
            errors: {
              message: "El usuario es requerido",
            },
          });
        }
        console.log(`${this.githubApi}/users/${params.username.trim()}`);

        const result = await axios.get(
          `${this.githubApi}/users/${params.username.trim()}`
        );

        console.log("result", result);
        if (!result.data) {
          return res.status(404).json({
            code: "NOT_FOUND",
            statusCode: 404,
            errors: {
              message: "El usuario no existe",
            },
          });
        }
        res.json(result.data);
      }
    );
    // -------------------------------------------------
    // API GITHUB

    this.app.get(`${this.originPath}/user`, (req, res) => {
      // let html = "<div>";
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.github.com/users/rpinedaec83',
        headers: {}
      };

      axios.request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));

          const data = response.data;
          console.log(data);
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
        });

      //console.log(JSON.stringify(response.data));

    })
    // -------------------------------------------------
    // API NASA

    this.app.get(`${this.originPath}${this.marsPath}`, async (req, res) => {
      const result = await axios.get(
        `${this.nasaApi}/insight_weather/?api_key=${this.nasaApiKey}&feedtype=json&ver=1.0`
      );

      res.json({
        success: true,
        data: result.data,
      });
    });

    // -------------------------------------------------
    // API CLIMA

    this.app.get(`${this.originPath}/clima`, (req, res) => {
      let html = "<div>";
      // let ciudad = req.query.ciudad;
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://weather-api99.p.rapidapi.com/weather?city=lima',
        headers: {
          'x-rapidapi-host': 'weather-api99.p.rapidapi.com',
          'x-rapidapi-key': '73d70d2c28msh7f79106bce6c25ep19a96ajsn943644966186'
        }
      };
      axios.request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          const data = response.data;
          console.log(data.main.temp - 273);
          res.json(data.main.temp - 273);
          html += `<label>Temperatura Celsius:</label><input value="${data.main.temp - 273.15}" disabled /> <br>`
          html += "</div>"
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // -------------------------------------------------
    // API DOLAR

    this.app.get(`${this.originPath}/dolar`, (req, res) => {
      // let html = "<div>";
      // let ciudad = req.query.ciudad;
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.frankfurter.app/latest?from=USD&to=EUR',
        headers: {}
      };


      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const data = response.data;
          console.log(data);
          res.json(data);
          // html += `<label>Temperatura Celsius:</label><input value="${data.main.temp - 273.15}" disabled /> <br>`
          // html += "</div>"
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // -------------------------------------------------
    // API POKEMON

    this.app.get(`${this.originPath}/pokemon`, (req, res) => {
      // let html = "<div>";
      // let ciudad = req.query.ciudad;
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://pokeapi.co/api/v2/pokemon/?limit=151',
        headers: {}
      };


      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const data = response.data;
          console.log(data);
          res.json(data);
          // html += `<label>Temperatura Celsius:</label><input value="${data.main.temp - 273.15}" disabled /> <br>`
          // html += "</div>"
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // -------------------------------------------------
    // API POKEMON DITTO

    this.app.get(`${this.originPath}/pokemonditto`, (req, res) => {
      // let html = "<div>";
      // let ciudad = req.query.ciudad;
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://pokeapi.co/api/v2/pokemon/ditto',
        headers: {}
      };


      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const data = response.data;
          console.log(data.abilities[0].ability.name);
          res.json(data.abilities[0].ability.name);
          // html += `<label>Temperatura Celsius:</label><input value="${data.main.temp - 273.15}" disabled /> <br>`
          // html += "</div>"
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // -------------------------------------------------
    // API RICK AND MORTY

    this.app.get(`${this.originPath}/rick`, (req, res) => {
      // let html = "<div>";
      // let ciudad = req.query.ciudad;
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://rickandmortyapi.com/api/character',
        headers: {}
      };


      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const data = response.data;
          console.log(data.results[0].name);
          res.json(data.results[0].name);
          
          // html += `<label>Temperatura Celsius:</label><input value="${data.main.temp - 273.15}" disabled /> <br>`
          // html += "</div>"
        })
        .catch((error) => {
          console.log(error);
        });
    });






  }

  dbConnection() { }
  middlewares() { }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

module.exports = {
  Server,
};
// -------------------------------------------------
// API CLIMA
