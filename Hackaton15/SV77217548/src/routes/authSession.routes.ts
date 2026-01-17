import {Router} from "express";
import * as controller from "../controllers/authSession.controller";
import requireAuthSession from "../middleware/authSession";
import csrfProtection from "../middleware/csrf";
import {authLimiter} from "../middleware/rateLimit";

const router = Router();

router.post("/session/register", authLimiter, (req, res) => {
    // #swagger.tags = ["Session"]
    return controller.register(req, res);
});
router.post("/session/login", authLimiter, (req, res) => {
    // #swagger.tags = ["Session"]
    return controller.login(req, res);
});
router.get("/csrf", requireAuthSession, csrfProtection, (req, res) => {
    // #swagger.tags = ["Session"]
    // #swagger.security = [{"sessionAuth": []}]
    return res.json({csrfToken: req.csrfToken()});
});
router.post("/session/logout", requireAuthSession, csrfProtection, (req, res) => {
    // #swagger.tags = ["Session"]
    // #swagger.security = [{"sessionAuth": []}]
    // #swagger.parameters["x-csrf-token"] = { in: "header", required: true, type: "string" }
    return controller.logout(req, res);
});
router.get("/me", requireAuthSession, (req, res) => {
    // #swagger.tags = ["Session"]
    // #swagger.security = [{"sessionAuth": []}]
    return controller.me(req, res);
});

export default router;
