import { request, response } from "express";
import { validationResult } from "express-validator";

const validateField = (req = request, res = response, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.mapped(),
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      message: "Error in validate fields middleware",
      error: err.message,
    });
  }
};

export { validateField };
