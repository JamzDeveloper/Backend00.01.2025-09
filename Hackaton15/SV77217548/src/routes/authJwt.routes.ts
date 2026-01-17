import {Router} from "express";
import * as controller from "../controllers/authJwt.controller";
import requireAuthJwt from "../middleware/authJwt";
import {authLimiter} from "../middleware/rateLimit";

const router = Router();

router.post("/jwt/login", authLimiter, (req, res) => {
    // #swagger.tags = ["JWT"]
    return controller.login(req, res);
});
router.post("/jwt/refresh", (req, res) => {
    // #swagger.tags = ["JWT"]
    // #swagger.security = [{"refreshAuth": []}]
    return controller.refresh(req, res);
});
router.post("/jwt/logout", (req, res) => {
    // #swagger.tags = ["JWT"]
    // #swagger.security = [{"refreshAuth": []}]
    return controller.logout(req, res);
});
router.get("/jwt/me", requireAuthJwt, (req, res) => {
    // #swagger.tags = ["JWT"]
    // #swagger.security = [{"bearerAuth": []}]
    return controller.me(req, res);
});

export default router;
