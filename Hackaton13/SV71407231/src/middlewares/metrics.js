const metrics = {};

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const key = `${req.method} ${req.originalUrl}`;

    if (!metrics[key]) {
      metrics[key] = { count: 0, totalTime: 0 };
    }

    metrics[key].count++;
    metrics[key].totalTime += Date.now() - start;
  });

  next();
};

export const getMetrics = () => metrics;