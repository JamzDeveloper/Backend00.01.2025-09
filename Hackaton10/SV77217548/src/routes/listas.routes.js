const express = require('express');
const {crearLista, listarListas, obtenerLista, duplicarLista, marcarItem,
    eliminarLista, actualizarLista} = require('../controllers/listas.controller');
const {authenticate} = require('../middlewares/auth');
const {asyncHandler} = require('../utils/async-handler');

const router = express.Router();

router.use(authenticate);

router.get('/', asyncHandler(listarListas));
router.get('/:id', asyncHandler(obtenerLista));
router.post('/', asyncHandler(crearLista));
router.post('/:id/duplicar', asyncHandler(duplicarLista));
router.patch('/:id/items/:itemId', asyncHandler(marcarItem));
router.patch('/:id', asyncHandler(actualizarLista));
router.delete('/:id', asyncHandler(eliminarLista));

module.exports = router;
