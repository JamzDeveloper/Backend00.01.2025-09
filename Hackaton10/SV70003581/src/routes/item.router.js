/*
- Crear una ruta para crear la lista
- - Nombre, Descripcion, Fecha, EsCompletado 
- Crear una ruta para mostrar los pendientes
- Crear una ruta para mostrar los completados
- Crear una ruta para completar un item de la lista
*/

const itemController = require('../controllers/item.controller');
const express = require('express');
const itemRouter = express.Router();


itemRouter.get('/completed', itemController.getCompletedItems);
itemRouter.get('/pendings', itemController.getPendingItems);
itemRouter.get('/:id', itemController.getItem);
itemRouter.put('/:id', itemController.updateItem);
itemRouter.delete('/:id', itemController.deleteItem);
itemRouter.post('/', itemController.addItem);
itemRouter.get('/', itemController.getItems);

module.exports = {itemRouter}