import { Router } from "express";
import { findAllUser } from "../services/user.service.js";
import { requireAuthSession } from "../middleware/authSession.middleware.js";
const router = Router();

router.get("/", requireAuthSession, (req, res) => {
  res.json(findAllUser());
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