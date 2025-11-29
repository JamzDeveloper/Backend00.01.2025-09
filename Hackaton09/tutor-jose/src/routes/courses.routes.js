const express = require("express");
const { Course, User, Op } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, published, ownerId } = req.body;
    if (!title || !ownerId) {
      return res.status(400).json({
        error:
          "El titulo, la descripcion y el id del instructor son obligatorios",
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
        error: "El usuario no es instructor o admin",
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

        /// traer las lesson
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

module.exports = router;
