import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import MateriaPrima from "../models/MateriaPrima.js";
import materiaPrimaRoutes from "../routes/materiaPrima.routes.js";
import Insumo from "../models/Insumo.js";
import insumoRoutes from "../routes/insumo.routes.js";
import Personal from "../models/Personal.js";
import personalRoutes from "../routes/personal.routes.js";
import Produccion from "../models/Produccion.js";
import produccionRoutes from "../routes/produccion.routes.js";


dotenv.config();
connectDB();
const app = express();
app.use(express.json());



app.use("/materia-prima", materiaPrimaRoutes);
app.use("/insumos", insumoRoutes);
app.use("/personal", personalRoutes);
app.use("/produccion", produccionRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor en http://localhost:${process.env.PORT || 3000}`);
});



