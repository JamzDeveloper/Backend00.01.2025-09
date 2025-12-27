import { Router } from "express";
import {
  createUser,
  getUserId,
  getUsers,
} from "../controllers/user.controller.js";
import { validateField } from "../middlewares/validate-field.middleware.js";
import { check } from "express-validator";
import { multerMiddleware } from "../middlewares/multer.middleware.js";

const route = Router();

route.get("/", getUsers);

route.get("/:userId", getUserId);
route.post(
  "/",
  multerMiddleware.single("avatar"),
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
