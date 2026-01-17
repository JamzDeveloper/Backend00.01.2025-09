import express from 'express';
import { getMetrics } from '../middlewares/metric.middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    service: 'api',
    metrics: getMetrics(),
  });
});

export {router as MetricRoute}
