require("dotenv").config();
const express = require("express");
const sequelize = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

//moddleware
app.use(express.json());

//test route
app.get("/", (req, res) => {
  res.json({
    message: "Mini learning platform API",
    version: "1.0.0",
    endpoints: {},
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(" Conexión a la base de datos establecida correctamente");

    const syncMode = process.env.DB_SYNC || "alter";

    if (syncMode !== "none") {
      await sequelize.sync({
        alert: syncMode === "alter",
        force: syncMode === "force",
      });
      console.log(`base de datos sincronizada (mode: ${syncMode})`);
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error("x Error al iniciar el servidor", err);
    process.exit(1);
  }
}

startServer();