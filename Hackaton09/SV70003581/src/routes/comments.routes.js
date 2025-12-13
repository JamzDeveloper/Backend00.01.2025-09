const express = require("express");
const { Comment, User, Lesson, Op } = require("../models");

const router = express.Router();

// POST /comments
router.post("/", async (req, res) => {
  try {
    const { body, userId, lessonId } = req.body;
    if (!body || !userId || !lessonId) return res.status(400).json({ error: "body, userId y lessonId son obligatorios" });

    // optional: verify user & lesson exist
    const comment = await Comment.create({ body, userId, lessonId });
    res.status(201).json({ message: "Comentario creado", data: comment });
  } catch (err) {
    res.status(500).json({ message: "Error creando comentario", error: err.message });
  }
});

// GET /comments/:id
router.get("/:id", async (req, res) => {
  try {
    const c = await Comment.findByPk(req.params.id, { include: [{ model: User, as: "author", attributes: ["id", "firstName"] }, { model: Lesson, as: "lesson", attributes: ["id", "title"] }] });
    if (!c) return res.status(404).json({ message: "Comentario no encontrado" });
    res.json({ message: "Comentario obtenido", data: c });
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo comentario", error: err.message });
  }
});

// PUT /comments/:id
router.put("/:id", async (req, res) => {
  try {
    const { body } = req.body;
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });
    if (!body || body.trim().length < 3) return res.status(400).json({ error: "El comentario debe tener al menos 3 caracteres" });

    await comment.update({ body: body.trim() });
    res.json({ message: "Comentario actualizado", data: comment });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando comentario", error: err.message });
  }
});

// DELETE /comments/:id
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });
    await comment.destroy();
    res.json({ message: "Comentario eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando comentario", error: err.message });
  }
});

// GET /comments (filtros)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const userId = req.query.userId;
    const lessonId = req.query.lessonId;

    const where = {};
    if (userId) where.userId = userId;
    if (lessonId) where.lessonId = lessonId;

    const { rows, count } = await Comment.findAndCountAll({
      where,
      include: [{ model: User, as: "author", attributes: ["id", "firstName"] }],
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    res.json({ message: "Comentarios obtenidos", data: rows, pagination: { page, pageSize, total: count, totalPages: Math.ceil(count / pageSize) } });
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo comentarios", error: err.message });
  }
});

module.exports = router;