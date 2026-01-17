import { Router } from "express";
import { requireToken } from "../middlewares/requireToken.js";
import { requireJson } from "../middlewares/requireJson.js";
import { Readable } from "stream";

const router = Router();

let orders = [
  { id: 1, customerId: 10, items: 2, total: 50 },
  { id: 2, customerId: 11, items: 1, total: 20 },
  { id: 3, customerId: 10, items: 5, total: 120 }
];

router.use(requireToken);

router.get("/", (req, res) => {
  const { page = 1, limit = 10, customerId, sort = "id" } = req.query;

  let data = [...orders];

  if (customerId) {
    data = data.filter(o => o.customerId == customerId);
  }

  data.sort((a, b) => (a[sort] > b[sort] ? 1 : -1));

  const start = (page - 1) * limit;
  const end = start + Number(limit);

  res.json({
    total: data.length,
    data: data.slice(start, end)
  });
});

router.post("/", requireJson, (req, res) => {
  const { items, customerId } = req.body;

  if (!items || !customerId) {
    return res.status(400).json({
      error: "items y customerId son obligatorios"
    });
  }

  const order = {
    id: orders.length + 1,
    items,
    customerId
  };

  orders.push(order);
  res.status(201).json(order);
});

router.get("/export", (req, res) => {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=orders.csv");

  const header = "id,customerId,items,total\n";
  const rows = orders.map(
    o => `${o.id},${o.customerId},${o.items},${o.total ?? ""}`
  );

  Readable.from([header, ...rows.map(r => r + "\n")]).pipe(res);
});

export default router;