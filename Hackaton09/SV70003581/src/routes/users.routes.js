const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Op } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        console.log("search user", req.query);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const role = req.query.role;
        const q = (req.query.q || "").trim();

        const where = {};

        if (role) {
            where.role = role;
        }
        if (q) {
            where[Op.or] = [
                { firstName: { [Op.like]: `%${q}%` } },
                { lastName: { [Op.like]: `%${q}%` } },
                { email: { [Op.like]: `%${q}%` } },
            ];
        }

        console.log("where filter", where[Op.or]);
        const { rows, count } = await User.findAndCountAll({
            where,
            attributes: { exclude: ["passwordHash"] },
            order: [["createdAt", "DESC"]],
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });

        res.json({
            message: "Usuarios obtenidos correctamente",
            data: rows,
            pagination: {
                page,
                pageSize,
                total: count,
                totalPages: Math.ceil(count / pageSize),
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Error al obtener los usuarios",
            error: err.message,
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        if (!firstName || !email) {
            return res.status(400).json({
                error: "El nombre y el correo son obligatorios",
            });
        }
        if (!password) {
            return res.status(400).json({
                error: "La contraseña es obligatoria",
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            passwordHash,
            role: role || "student",
        });
        const userResponse = user.toJSON();
        delete userResponse.passwordHash;
        res.status(201).json({
            message: "Usuario creado correctamente",
            data: userResponse,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error al crear el usuario",
            error: err.message,
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { firstName, lastName, email, password, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        // Campos opcionales
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role) user.role = role;

        // Si mandan password → generar nuevo hash
        if (password) {
            user.passwordHash = await bcrypt.hash(password, 10);
        }

        await user.save();

        const userResponse = user.toJSON();
        delete userResponse.passwordHash;

        return res.json({
            message: "Usuario actualizado correctamente",
            data: userResponse,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar el usuario",
            error: err.message,
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        await user.destroy();

        return res.json({
            message: "Usuario eliminado correctamente",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al eliminar el usuario",
            error: err.message,
        });
    }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["passwordHash"] },
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario obtenido", data: user });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuario", error: err.message });
  }
});

module.exports = router;