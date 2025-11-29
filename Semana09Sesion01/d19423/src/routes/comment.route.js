
const controller = require('../controllers/comment.controller')
const express = require('express');
const commentRouter = express.Router();

commentRouter.get('/',controller.getComments);
commentRouter.post("/:postId/:userId",controller.createComment);

module.exports = {commentRouter};