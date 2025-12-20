const router = require('express').Router();
const controller = require('../controllers/supply.controller');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(controller.listSupplies));
router.get('/:id', asyncHandler(controller.getSupply));
router.post('/', asyncHandler(controller.createSupply));
router.patch('/:id', asyncHandler(controller.updateSupply));
router.delete('/:id', asyncHandler(controller.deleteSupply));
router.post('/:id/purchase', asyncHandler(controller.purchaseSupply));

module.exports = router;
