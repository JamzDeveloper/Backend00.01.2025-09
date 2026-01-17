import { Router } from "express";

import { requireAuthSession } from "../middlewares/authSession.middleware.js";
import { logIn, refresh } from "../controllers/authJwt.controller.js";

const router = Router();

router.post("/login", logIn);
router.post("/refresh", requireAuthSession, refresh);

export { router as AuthJwtRoute };