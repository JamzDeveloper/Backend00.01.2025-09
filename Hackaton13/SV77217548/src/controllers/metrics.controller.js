const {metrics} = require('../middlewares');

exports.getMetrics = async (req, res) => {
    res.json(metrics.getMetricsSnapshot());
};
