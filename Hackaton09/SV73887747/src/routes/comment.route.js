const express = require('express')
const commentRouter = express.Router();
const commentController = require('../controllers/comment.controller');

commentRouter.post('/:lessonId/:userId', commentController.createComment);

module.exports = commentRouter;