import express from "express";
import MateriaPrima from "../models/MateriaPrima.js";
import Insumo from "../models/Insumo.js";
import Personal from "../models/Personal.js";
import Produccion from "../models/Produccion.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const cantidad = Number(req.body.cantidad);

        if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
            message: "La cantidad debe ser un número mayor a 0"
        });
        }

        const tablonReq = 1 * cantidad;
        const gomaReq = 0.25 * cantidad;
        const horasReq = 8 * cantidad;

        const tablon = await MateriaPrima.findOne({ nombre: "Tablón" });
        const goma = await Insumo.findOne({ nombre: "Goma" });
        const personal = await Personal.findOne({ horasDisponibles: { $gt: 0 } });
        if (!tablon || tablon.cantidad < tablonReq)
        return res.status(400).json({ message: "No hay tablones suficientes" });

        if (!goma || goma.cantidad < gomaReq)
        return res.status(400).json({ message: "No hay goma suficiente" });

        if (!personal || personal.horasDisponibles < horasReq)
        return res.status(400).json({ message: "No hay horas disponibles" });

        tablon.cantidad -= tablonReq;
        goma.cantidad -= gomaReq;
        personal.horasDisponibles -= horasReq;

        await tablon.save();
        await goma.save();
        await personal.save();

        const produccion = await Produccion.create({
        producto: "Armario",
        tablon: tablonReq,
        gomaKg: gomaReq,
        horasHombre: horasReq
        });

        res.json({
        message: `Se produjeron ${cantidad} armarios`,
        produccion
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const data = await Produccion.find();
    res.json(data);
});

export default router;