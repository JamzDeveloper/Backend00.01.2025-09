const metrics = {};

function metricsMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const key = `${req.method} ${req.originalUrl}`;

    if (!metrics[key]) {
      metrics[key] = {
        count: 0,
        totalDuration: 0,
      };
    }

    metrics[key].count += 1;
    metrics[key].totalDuration += duration;
  });

  next();
}

function getMetrics() {
  return Object.entries(metrics).map(([route, data]) => ({
    route,
    calls: data.count,
    avgDurationMs: Math.round(data.totalDuration / data.count),
  }));
}

export {
  metricsMiddleware,
  getMetrics,
};
