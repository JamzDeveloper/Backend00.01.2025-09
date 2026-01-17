const express = require('express');
const produccionController = require('../controllers/produccion.controller');
const asyncHandler = require('../utils/asyncHandler')
const router = express.Router();

router.post('/', asyncHandler(produccionController.producir));
router.get('/', asyncHandler(produccionController.getAll));
router.get('/:id', asyncHandler(produccionController.getById));
router.patch('/:id', asyncHandler(produccionController.actualizar));
router.delete('/:id', asyncHandler(produccionController.eliminarUno));

module.exports = router;