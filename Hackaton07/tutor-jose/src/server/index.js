const express = require("express");
const { default: axios } = require("axios");
class Server {
  originPath = "/api";
  githubPath = "/github";
  marsPath = "/mars";

  constructor() {
    this.port = process.env.PORT || 4000;
    this.githubApi = process.env.GITHUB_API;
    this.nasaApi = process.env.NASA_API;
    this.nasaApiKey = process.env.NASA_API_KEY;
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
  }

  dbConnection() {}
  middlewares() {}

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

module.exports = {
  Server,
};
