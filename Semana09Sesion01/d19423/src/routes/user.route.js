
const userController = require('../controllers/user.controller');

const express = require('express');
const userRouter = express.Router();

userRouter.post('/', userController.addUser);
userRouter.put('/:id',userController.updateUser);
userRouter.delete('/:id', userController.deleteUser)

module.exports = {userRouter}