import express from "express";
import Item from "../models/Item.model.js";

const router = express.Router();

router.post("/crear", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
    const item = await Item.create({ nombre, descripcion });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear item" });
  }
});

router.get("/pendientes", async (req, res) => {
  const items = await Item.find({ esCompletado: false }).sort({ fecha: -1 });
  res.json(items);
});

router.get("/completados", async (req, res) => {
  const items = await Item.find({ esCompletado: true }).sort({ fecha: -1 });
  res.json(items);
});

router.put("/completar/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { esCompletado: true }, { new: true });
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al completar" });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar" });
  }
});

export default router;