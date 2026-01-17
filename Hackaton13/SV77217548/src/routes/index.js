const router = require('express').Router();
const healthController = require('../controllers/health');
const dataController = require('../controllers/data');
const metricsController = require('../controllers/metrics.controller');
const streamController = require('../controllers/stream.controller');
const {asyncHandler, validateApiKey} = require('../middlewares');
const v1Router = require('./v1');

router.get('/health', asyncHandler(healthController.getHealth));
router.post('/data', asyncHandler(dataController.createData));
router.get('/metrics', asyncHandler(metricsController.getMetrics));
router.get('/stream', asyncHandler(streamController.streamTicks));
router.use('/v1', validateApiKey, v1Router);

module.exports = router;
