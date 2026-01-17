const express = require('express');
const router = express.Router();
const materiaPrimaController = require('../controllers/materiaPrima.controller');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', asyncHandler(materiaPrimaController.comprar));
router.get('/', asyncHandler(materiaPrimaController.getAll));
router.get('/:id', asyncHandler(materiaPrimaController.getById));
router.patch('/:id', asyncHandler(materiaPrimaController.actualizar));
router.delete('/:id', asyncHandler(materiaPrimaController.eliminarUno));

module.exports = router;