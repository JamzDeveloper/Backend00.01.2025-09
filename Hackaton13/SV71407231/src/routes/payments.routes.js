import { Router } from "express";
import { idempotency } from "../middlewares/idempotency.js";

const router = Router();

router.post("/", idempotency, (req, res) => {
  const { amount, method } = req.body;

  if (!amount || !method) {
    return res.status(400).json({
      error: "amount y method son obligatorios"
    });
  }

  const response = {
    id: Date.now(),
    estado: "pagado",
    amount,
    method
  };

  res.saveResponse(response);
  res.status(201).json(response);
});

export default router;