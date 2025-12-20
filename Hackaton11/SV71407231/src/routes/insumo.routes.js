import express from "express";
import Insumo from "../models/Insumo.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const insumo = await Insumo.create(req.body);
    res.json(insumo);
});

router.get("/", async (req, res) => {
    const data = await Insumo.find();
    res.json(data);
});

router.put("/:id", async (req, res) => {
    const insumo = await Insumo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(insumo);
});

router.delete("/:id", async (req, res) => {
    await Insumo.findByIdAndDelete(req.params.id);
    res.json({ message: "Eliminado" });
});

export default router;