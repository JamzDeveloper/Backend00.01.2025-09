import { Router } from "express";

import { requireAuthSession } from "../middlewares/authSession.middleware.js";
import { logIn, logOut, me } from "../controllers/authSession.controller.js";

const router = Router();

router.post("/login", logIn);
router.get("/me", requireAuthSession, me);
router.post("/logout", requireAuthSession, logOut);


export { router as AuthSessionRoute };