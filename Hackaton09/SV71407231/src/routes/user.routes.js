const express = require("express");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../models");

const router = express.Router();


function safeUser(userInstance) {
  if (!userInstance) return null;
  const u = userInstance.toJSON ? userInstance.toJSON() : userInstance;
  delete u.passwordHash;
  return u;
}

router.get("/", async (req, res) => {
  try {
    const role = req.query.role;
    const q = (req.query.q || "").trim();
    const page = parseInt(req.query.page || "1");
    const pageSize = Math.min(parseInt(req.query.pageSize || "10"), 100);

    const where = {};
    if (role) where.role = role;

    if (q) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${q}%` } },
        { lastName: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["passwordHash"] },
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: (page - 1) * pageSize
    });

    res.json({
      total: count,
      page,
      pageSize,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role || "student"
    });

    res.status(201).json(safeUser(user));
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email ya registrado" });
    }
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Error al crear usuario" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ["passwordHash"] } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const updates = {};
    if (firstName) updates.firstName = firstName.trim();
    if (lastName) updates.lastName = lastName.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (role) updates.role = role;
    if (password) updates.passwordHash = await bcrypt.hash(String(password), 10);

    await User.update(updates, { where: { id: req.params.id } });

    const updated = await User.findByPk(req.params.id, { attributes: { exclude: ["passwordHash"] } });
    res.json(safeUser(updated));
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email ya registrado" });
    }
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;