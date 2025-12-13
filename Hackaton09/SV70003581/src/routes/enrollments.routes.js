const express = require("express");
const { Enrollment, User, Course, Op } = require("../models");

const router = express.Router();

// POST /enrollments -> inscribir (userId + courseId)
router.post("/", async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) return res.status(400).json({ error: "userId y courseId son obligatorios" });

    // opcional: comprobar si ya existe
    const exists = await Enrollment.findOne({ where: { userId, courseId } });
    if (exists) return res.status(409).json({ error: "Usuario ya inscrito en el curso" });

    const enr = await Enrollment.create({ userId, courseId, status: "pending" });
    res.status(201).json({ message: "Inscripción creada", data: enr });
  } catch (err) {
    res.status(500).json({ message: "Error creando inscripción", error: err.message });
  }
});

// DELETE /enrollments/:id
router.delete("/:id", async (req, res) => {
  try {
    const enr = await Enrollment.findByPk(req.params.id);
    if (!enr) return res.status(404).json({ message: "Enrollment no encontrado" });
    await enr.destroy();
    res.json({ message: "Enrollment eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando enrollment", error: err.message });
  }
});

// GET /enrollments (filtros por userId / courseId)
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const courseId = req.query.courseId;
    const where = {};
    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;

    const enrolls = await Enrollment.findAll({ where, include: [{ model: User, attributes: ["id", "firstName"] }, { model: Course, attributes: ["id", "title"] }] });
    res.json({ message: "Enrollments obtenidos", data: enrolls });
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo enrollments", error: err.message });
  }
});

// PATCH /enrollments/:id/status -> cambiar estado (pending -> active)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, score } = req.body;
    const enr = await Enrollment.findByPk(req.params.id);
    if (!enr) return res.status(404).json({ message: "Enrollment no encontrado" });

    if (status) enr.status = status;
    if (score !== undefined) enr.score = score;
    await enr.save();
    res.json({ message: "Enrollment actualizado", data: enr });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando enrollment", error: err.message });
  }
});

module.exports = router;
