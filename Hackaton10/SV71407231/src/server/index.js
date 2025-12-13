import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import itemsRoutes from "../routes/item.route.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/items", itemsRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor iniciado en puerto", PORT));

