import { Router } from "express";
import { requireJson } from "../middlewares/requireJson.js";

const router = Router();

const users = [];
let idCounter = 1;

router.get("/", (req, res) => {
  res.json(users);
});

router.post("/", requireJson, (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Nombre y email son obligatorios"
    });
  }

  const user = {
    id: idCounter++,
    name,
    email
  };

  users.push(user);
  res.status(201).json(user);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  res.json(user);
});

export default router;