const postController = require('../controllers/post.controller');

const express = require('express');
const postRouter = express.Router();


postRouter.post('/:authorId', postController.addPost)
postRouter.get('/',postController.getPosts)
postRouter.delete('/:id', postController.deletePost)
postRouter.get('/:id',postController.getPostsById)

module.exports = {postRouter};