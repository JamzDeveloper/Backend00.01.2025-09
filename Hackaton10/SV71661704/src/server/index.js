import dotenv from "dotenv";
import express from "express";
import { mongoose } from "../config/db.js";
import { ItemRoute } from "../routes/item.route.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//moddleware
app.use(express.json());

//from
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

//test route
app.get("/api", (req, res) => {
  res.json({
    message: "Sales API",
    version: "1.0.0",
    endpoints: {},
  });
});

//route services
app.use("/api/items", ItemRoute);

async function startServer() {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("Connected!"));

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error("x Error al iniciar el servidor", err);
    process.exit(1);
  }
}

startServer();