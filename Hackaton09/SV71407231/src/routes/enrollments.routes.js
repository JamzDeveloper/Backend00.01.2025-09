const express = require("express");
const { Enrollment, User, Course } = require("../models");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const data = await Enrollment.findAll({
      include: [
        { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        { model: Course, attributes: ["id", "title"] }
      ],
      order: [["id", "DESC"]]
    });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar enrollments" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: Course }
      ]
    });

    if (!enrollment)
      return res.status(404).json({ error: "Enrollment no encontrado" });

    res.json(enrollment);

  } catch (err) {
    res.status(500).json({ error: "Error al obtener enrollment" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId)
      return res.status(400).json({ error: "Faltan campos requeridos" });

    const enrollment = await Enrollment.create({ userId, courseId });

    res.status(201).json(enrollment);

  } catch (err) {
    res.status(500).json({ error: "Error al crear enrollment" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Enrollment.destroy({
      where: { id: req.params.id }
    });

    if (!deleted)
      return res.status(404).json({ error: "Enrollment no encontrado" });

    res.json({ message: "Enrollment eliminado" });

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar enrollment" });
  }
});

module.exports = router;