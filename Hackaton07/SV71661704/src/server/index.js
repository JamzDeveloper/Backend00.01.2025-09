const express = require("express");
const { default: axios } = require("axios");
class Server {
  originPath = "/api";
  githubPath = "/github";
  marsPath = "/mars";
  pokePath = '/poke';
  climaPath = '/clima'
  monedaPath = '/moneda'

  constructor() {
    this.port = process.env.PORT || 4000;
    this.githubApi = process.env.GITHUB_API;
    this.nasaApi = process.env.NASA_API;
    this.nasaApiKey = process.env.NASA_API_KEY;
    this.pokeApi = process.env.POKE_API;
    this.climaApi = process.env.CLIMA_API;
    this.climaApiKey = process.env.CLIMA_API_KEY
    this.monedaApi = process.env.MONEDA_API
    this.monedaApiKey = process.env.MONEDA_API_KEY
    this.app = express();

    this.routes();

    this.dbConnection();
    this.dbConnection();
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

    // API POKEMON

    this.app.get(`${this.originPath}${this.pokePath}`, async (req, res) => {
      const result = await axios.get(
        `${this.pokeApi}?limit=20000`
      );
      res.json({
        success: true,
        data: result.data,
      });

    })

    // API CLIMA

    this.app.get(`${this.originPath}${this.climaPath}`, async (req, res) => {
      const result = await axios.get(
        `${this.climaApi}/data/2.5/weather?q=Lima&appid=${this.climaApiKey}`
      )
      res.json({
        success: true,
        data: result.data
      })
    })

    // API MONEDA

    this.app.get(`${this.originPath}${this.monedaPath}`, async (req, res) => {
      try {
        const result = await axios.get(
          `${this.monedaApi}average?currency=USD&apiKey=${this.monedaApiKey}`
        );

        res.json({
          success: true,
          data: result.data
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error al consultar el tipo de cambio',
          error: error.message
        });
      }
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
