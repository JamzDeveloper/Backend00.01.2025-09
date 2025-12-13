const express = require("express");
const { Comment, User, Lesson, Course } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, as: "author", attributes: ["id", "firstName", "lastName", "email"] },
        {
          model: Lesson,
          as: "lesson",
          attributes: ["id", "title", "slug", "order"],
          include: [
            { model: Course, as: "course", attributes: ["id", "title"] }
          ]
        }
      ],
      order: [["id", "DESC"]],
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar comments" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "firstName", "lastName", "email"] },
        {
          model: Lesson,
          as: "lesson",
          attributes: ["id", "title", "slug", "order"],
          include: [{ model: Course, as: "course", attributes: ["id", "title"] }]
        }
      ]
    });

    if (!comment) return res.status(404).json({ error: "Comment no encontrado" });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener comment" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { body, userId, lessonId } = req.body;

    if (!body || !userId || !lessonId)
      return res.status(400).json({ error: "Faltan campos requeridos" });

    const comment = await Comment.create({
      body: body.trim(),
      userId,
      lessonId
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);  
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Comment.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Comment no encontrado" });
    res.json({ message: "Comment eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar comment" });
  }
});

module.exports = router;