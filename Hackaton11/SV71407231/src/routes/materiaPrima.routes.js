import express from "express";
import MateriaPrima from "../models/MateriaPrima.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const mp = await MateriaPrima.create(req.body);
    res.json(mp);
});

router.get("/", async (req, res) => {
    const data = await MateriaPrima.find();
    res.json(data);
});

router.put("/:id", async (req, res) => {
    const mp = await MateriaPrima.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(mp);
});

router.delete("/:id", async (req, res) => {
    await MateriaPrima.findByIdAndDelete(req.params.id);
    res.json({ message: "Eliminado" });
});

export default router;