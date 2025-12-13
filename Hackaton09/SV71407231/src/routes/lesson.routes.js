const express = require("express");
const { Op } = require("sequelize");
const { Lesson, Course } = require("../models");

const router = express.Router();


function clean(lesson) {
  if (!lesson) return null;
  return lesson.toJSON();
}


router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const courseId = req.query.courseId;
    const page = parseInt(req.query.page || "1");
    const pageSize = Math.min(parseInt(req.query.pageSize || "10"), 100);

    const where = {};
    if (courseId) where.courseId = courseId;

    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { body: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { rows, count } = await Lesson.findAndCountAll({
      where,
      include: {
        model: Course,
        as: "course",
        attributes: ["id", "title"]
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [["order", "ASC"]],
    });

    res.json({
      total: count,
      page,
      pageSize,
      data: rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error listando lecciones" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: { 
        model: Course,
        as: "course",
        attributes: ["id", "title"]
      }
    });

    if (!lesson) return res.status(404).json({ error: "Lección no encontrada" });

    res.json(clean(lesson));

  } catch (err) {
    res.status(500).json({ error: "Error obteniendo la lección" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, body, order, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: "Curso no existe" });

    const lesson = await Lesson.create({
      title: title.trim(),
      body: body || "",
      order: order ?? 1,
      courseId,
    });

    res.status(201).json(clean(lesson));

  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Slug ya existe en este curso" });
    }
    res.status(500).json({ error: "Error creando lección" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, body, order } = req.body;

    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lección no encontrada" });

    await lesson.update({
      title: title ?? lesson.title,
      body: body ?? lesson.body,
      order: order ?? lesson.order,
    });

    res.json(clean(lesson));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando lección" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Lesson.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) return res.status(404).json({ error: "Lección no encontrada" });

    res.json({ message: "Lección eliminada" });

  } catch (err) {
    res.status(500).json({ error: "Error eliminando lección" });
  }
});

module.exports = router;