const metricsStore = new Map();
const startedAt = Date.now();

const getRouteKey = (req) => {
    if (req.route){
        return `${req.method} ${req.baseUrl}${req.route.path}`
    }
    const pathOnly = req.originalUrl.split('?')[0];
    return `${req.method} ${pathOnly}`;
};

const trackMetrics = (req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        const key = getRouteKey(req);
        const metric = metricsStore.get(key) || {count: 0, totalMs: 0, statuses: {}};
        metric.count += 1;
        metric.totalMs += durationMs;

        const status = String(res.statusCode);
        metric.statuses[status] = (metric.statuses[status] || 0) + 1;

        metricsStore.set(key, metric);
    });
    next();
};

const getMetricsSnapshot = () => {
    const routes = [];
    let totalRequests = 0;

    metricsStore.forEach((metric, key) => {
        totalRequests += metric.count;
        routes.push({
            route: key,
            count: metric.count,
            avgMs: Number((metric.totalMs / metric.count).toFixed(2)),
            statuses: metric.statuses
        });
    });

    return{
        uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
        totalRequests,
        routes
    };
};

module.exports = {trackMetrics, getMetricsSnapshot};
