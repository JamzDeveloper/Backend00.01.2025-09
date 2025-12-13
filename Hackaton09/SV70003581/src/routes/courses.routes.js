const express = require("express");
const sequelize = require("../db");
const { Course, User, Lesson, Enrollment, Op } = require("../models");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({
      where: { slug },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Lesson,
          as: "lessons",
          attributes: ["id","title"],
        }
      ],
    });
    if (!course) {
      return res.status(404).json({
        error: "El curso no existe",
      });
    }
    const result = course.toJSON();
    res.json({
      message: "Curso obtenido correctamente",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener el curso",
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, published, ownerId } = req.body;
    if (!title || !description || !ownerId) {
      return res.status(400).json({
        error:
          "El titulo, la descripcin y el id del instructor son obligatorios",
      });
    }
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(400).json({
        error: "El usuario no existe",
      });
    }
    if (owner.role != "instructor" && owner.role != "admin") {
      return res.status(400).json({
        error: "El usuario no es instructor o admin.",
      });
    }
    const course = await Course.create({
      title,
      description,
      published,
      ownerId,
    });
    res.status(201).json({
      message: "Curso creado correctamente",
      data: course,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al crear el curso",
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, published } = req.body;
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Curso no encontrado" });

    if (title && title.length < 3) return res.status(400).json({ error: "El título debe tener mínimo 3 caracteres" });
    if (description && description.length < 10) return res.status(400).json({ error: "La descripción debe tener mínimo 10 caracteres" });

    await course.update({ title: title ?? course.title, description: description ?? course.description, published: published ?? course.published });
    res.json({ message: "Curso actualizado correctamente", data: course });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando curso", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const t = await Course.sequelize.transaction();
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      await t.rollback();
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // soft-delete related records (or force true if you want physical delete)
    await sequelize.query(`DELETE FROM comments WHERE "lessonId" IN (SELECT id FROM lessons WHERE "courseId" = :cid)`, { replacements: { cid: course.id }, transaction: t });
    await Lesson.destroy({ where: { courseId: course.id }, transaction: t });
    await Enrollment.destroy({ where: { courseId: course.id }, transaction: t });
    await course.destroy({ transaction: t });

    await t.commit();
    res.json({ message: "Curso eliminado correctamente" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Error eliminando curso", error: err.message });
  }
});

module.exports = router;