const express = require("express");
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

module.exports = router;
