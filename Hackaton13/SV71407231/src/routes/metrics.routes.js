import { Router } from "express";
import { getMetrics } from "../middlewares/metrics.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getMetrics());
});

export default router;