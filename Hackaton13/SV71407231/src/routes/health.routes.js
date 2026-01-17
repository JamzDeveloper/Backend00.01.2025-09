import { Router } from "express";
const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.post("/data", (req, res) => {
  res.status(200).json({ received: true });
});

export default router;