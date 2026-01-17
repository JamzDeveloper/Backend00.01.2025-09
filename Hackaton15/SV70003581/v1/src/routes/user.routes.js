import { Router } from "express";

import { requireAuthSession } from "../middlewares/authSession.middleware.js";
import { verifyTokenJwt } from "../middlewares/validate-jwt.middleware.js";
import {showOnlyAdmins,showOnlyUsers} from "../controllers/user.controller.js";

const router = Router();

router.get("/", requireAuthSession, showOnlyUsers);
router.get("/admin", verifyTokenJwt, showOnlyAdmins);

export { router as UserRoute };