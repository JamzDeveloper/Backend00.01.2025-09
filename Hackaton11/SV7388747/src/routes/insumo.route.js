const express = require('express');
const InsumoController = require('../controllers/insumo.controller');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

router.post('/', asyncHandler(InsumoController.comprar));
router.get('/', asyncHandler(InsumoController.getAll));
router.get('/:id', asyncHandler(InsumoController.getById));
router.patch('/:id', asyncHandler(InsumoController.actualizar));
router.delete('/:id', asyncHandler(InsumoController.eliminarUno));

module.exports = router;