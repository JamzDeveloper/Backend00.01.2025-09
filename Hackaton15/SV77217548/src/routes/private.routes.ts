import {Router} from "express";
import requireAuthSession from "../middleware/authSession";
import requireAuthAny from "../middleware/authAny";
import requireRole from "../middleware/requireRole";

const router = Router();

router.get("/private/profile", requireAuthSession, (req, res) => {
    // #swagger.tags = ["Private"]
    // #swagger.security = [{"sessionAuth": []}]
    res.json({user: req.session.user});
});

router.get("/admin/stats", requireAuthAny, requireRole("admin"), (_req, res) => {
    // #swagger.tags = ["Admin"]
    // #swagger.security = [{"sessionAuth": []}, {"bearerAuth": []}]
    res.json({ok: true, message: "Acceso permitido a admin"});
});

export default router;
