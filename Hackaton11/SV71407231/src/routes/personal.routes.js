import express from "express";
import Personal from "../models/Personal.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const persona = await Personal.create(req.body);
    res.json(persona);
});

router.get("/", async (req, res) => {
    const data = await Personal.find();
    res.json(data);
});

router.put("/:id", async (req, res) => {
    const persona = await Personal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(persona);
});

router.delete("/:id", async (req, res) => {
    await Personal.findByIdAndDelete(req.params.id);
    res.json({ message: "Eliminado" });
});

export default router;