const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const horaTrabajadaController = require('../controllers/horaTrabajada.controller');

const router = express.Router();

router.post('/', asyncHandler(horaTrabajadaController.registrar));
router.get('/', asyncHandler(horaTrabajadaController.getAll));
router.get('/:id', asyncHandler(horaTrabajadaController.getById));
router.patch('/:id', asyncHandler(horaTrabajadaController.actualizar));
router.delete('/:id', asyncHandler(horaTrabajadaController.eliminarUno));

module.exports = router;
