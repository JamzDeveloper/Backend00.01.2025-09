const express = require("express");
const { Op } = require("sequelize");
const { Course, User } = require("../models");

const router = express.Router();

function clean(course) {
  if (!course) return null;
  return course.toJSON();
}

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const published = req.query.published;
    const page = parseInt(req.query.page || "1");
    const pageSize = Math.min(parseInt(req.query.pageSize || "10"), 100);

    const where = {};

    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }

    if (published === "true") where.published = true;
    if (published === "false") where.published = false;

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "firstName", "lastName", "email"]
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [["id", "DESC"]],
    });

    res.json({
      total: count,
      page,
      pageSize,
      data: rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar cursos" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "firstName", "lastName", "email"]
      }
    });

    if (!course) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(clean(course));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener curso" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { title, slug, description, published, studentsCount, ownerId } = req.body;

    if (!title || !slug || !ownerId) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const course = await Course.create({
      title: title.trim(),
      slug: slug.trim(),
      description: description ? description.trim() : null,
      published: !!published,
      studentsCount: studentsCount ?? 0,
      ownerId
    });

    res.status(201).json(clean(course));

  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Título o slug ya existente" });
    }
    res.status(500).json({ error: "Error al crear curso" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { title, slug, description, published, studentsCount, ownerId } = req.body;

    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Curso no encontrado" });

    await course.update({
      title: title ?? course.title,
      slug: slug ?? course.slug,
      description: description ?? course.description,
      published: typeof published === "boolean" ? published : course.published,
      studentsCount: studentsCount ?? course.studentsCount,
      ownerId: ownerId ?? course.ownerId
    });

    res.json(clean(course));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar curso" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json({ message: "Curso eliminado" });

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar curso" });
  }
});

module.exports = router;