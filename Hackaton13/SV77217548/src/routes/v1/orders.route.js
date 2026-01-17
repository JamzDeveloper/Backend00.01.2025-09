const router = require('express').Router();
const controller = require('../../controllers/orders.controller');
const {asyncHandler, validateOrders, validateAuth} = require('../../middlewares');

// Proteccion con header x-token para todas las rutas de ordenes.
router.use(validateAuth);

router.get('/', asyncHandler(controller.listOrders));
router.post('/', [validateOrders.dtoCreateOrder], asyncHandler(controller.createOrder));
router.get('/export', asyncHandler(controller.exportOrders));

module.exports = router;
