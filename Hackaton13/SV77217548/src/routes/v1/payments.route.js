const router = require('express').Router();
const controller = require('../../controllers/payments.controller');
const {asyncHandler} = require('../../middlewares');

router.post('/', asyncHandler(controller.createPayment));

module.exports = router;
