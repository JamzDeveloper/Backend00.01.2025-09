const metrics = {};

function metricsMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const key = `${req.method} ${req.originalUrl}`; // GET /api/v1/metrics
    
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

function logger(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', ()=>{
    const dur = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(dur);
  })
  next();
}

export {
  metricsMiddleware,
  getMetrics,
  logger
};
