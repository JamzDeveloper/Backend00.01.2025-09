const router = require('express').Router();
const controller = require('../controllers/material.controller');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(controller.listMaterials));
router.get('/:id', asyncHandler(controller.getMaterial));
router.post('/', asyncHandler(controller.createMaterial));
router.patch('/:id', asyncHandler(controller.updateMaterial));
router.delete('/:id', asyncHandler(controller.deleteMaterial));
router.post('/:id/purchase', asyncHandler(controller.purchaseMaterial));

module.exports = router;
