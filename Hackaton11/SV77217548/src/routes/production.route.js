const router = require('express').Router();
const controller = require('../controllers/production.controller');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(controller.listProductions));
router.get('/:id', asyncHandler(controller.getProduction));
router.post('/', asyncHandler(controller.createProduction));

module.exports = router;
