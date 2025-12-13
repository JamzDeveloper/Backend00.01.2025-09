const express = require("express");
const sequelize = require("../db");
const { Lesson, Course, Comment, Op } = require("../models");

const router = express.Router();

// POST /lessons (create)
router.post("/", async (req, res) => {
  try {
    const { title, body, order, courseId } = req.body;
    if (!title || !body || !courseId) return res.status(400).json({ error: "title, body y courseId son obligatorios" });

    // ensure course exists
    const c = await Course.findByPk(courseId);
    if (!c) return res.status(400).json({ error: "courseId inválido" });

    const lesson = await Lesson.create({ title, body, order: order ?? 1, courseId });
    res.status(201).json({ message: "Lección creada correctamente", data: lesson });
  } catch (err) {
    res.status(500).json({ message: "Error creando lección", error: err.message });
  }
});

// GET /lessons (list)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const q = (req.query.q || "").trim();
    const courseId = req.query.courseId;

    const where = {};
    if (q) where.title = { [Op.like]: `%${q}%` };
    if (courseId) where.courseId = courseId;

    const { rows, count } = await Lesson.findAndCountAll({
      where,
      include: [{ model: Course, as: "course", attributes: ["id", "title"] }],
      order: [["order", "ASC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    res.json({ message: "Lecciones obtenidas", data: rows, pagination: { page, pageSize, total: count, totalPages: Math.ceil(count / pageSize) } });
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo lecciones", error: err.message });
  }
});

// GET /lessons/:id
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, { include: [{ model: Comment, as: "comments" }] });
    if (!lesson) return res.status(404).json({ message: "Lección no encontrada" });
    res.json({ message: "Lección obtenida", data: lesson });
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo lección", error: err.message });
  }
});

// PUT /lessons/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, body, order } = req.body;
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lección no encontrada" });

    if (title && title.length < 3) return res.status(400).json({ error: "El título debe tener mínimo 3 caracteres" });
    if (body && body.length < 20) return res.status(400).json({ error: "El body debe tener mínimo 20 caracteres" });

    await lesson.update({ title: title ?? lesson.title, body: body ?? lesson.body, order: order ?? lesson.order });
    res.json({ message: "Lección actualizada", data: lesson });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando lección", error: err.message });
  }
});

// DELETE /lessons/:id
router.delete("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lección no encontrada" });
    await lesson.destroy();
    res.json({ message: "Lección eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando lección", error: err.message });
  }
});

module.exports = router;
