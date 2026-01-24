import { Router } from "express";
import { findAdminUser, findAllUser } from "../services/user.service.js";
import { requireAuthSession } from "../middleware/authSession.middleware.js";
import { verifyTokenJwt } from "../middleware/validate-jwt.middleware.js";
const router = Router();

router.get("/", requireAuthSession, (req, res) => {
  ///cambiar  solo mostrar usuarios con el role user
  res.json(findAllUser());
});

router.get("/admin", verifyTokenJwt, (req, res) => {
  
  res.json(findAdminUser());
});

export { router as UserRoute };

/**
 * success:boolean
 * statusCode:number
 * message:string,
 * data:any
 * errors:[object]
 *
 *
 */
