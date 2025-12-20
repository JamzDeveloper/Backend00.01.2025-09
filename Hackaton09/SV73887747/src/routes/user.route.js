const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/user.controller');

userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getUsers);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

module.exports = userRouter;