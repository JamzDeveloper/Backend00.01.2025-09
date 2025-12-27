import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { validateField } from "../middlewares/validate-field.middleware.js";
import { check } from "express-validator";

const route = Router();

route.get("/", getUsers);
route.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    validateField,
  ],
  createUser
);

export { route as UserRoute };
