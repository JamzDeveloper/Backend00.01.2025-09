const express = require('express');
const lessonRouter = express.Router();
const lessonController = require('../controllers/lesson.controller');

lessonRouter.post('/:courseId', lessonController.createLesson);
lessonRouter.get('/course/:courseId', lessonController.getLessonsByCourse);

module.exports = lessonRouter;
