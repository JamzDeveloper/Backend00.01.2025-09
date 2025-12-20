const express = require('express');
const courseRouter = express.Router();
const courseController = require('../controllers/course.controller');

courseRouter.get('/', courseController.getCourses);
courseRouter.get('/:slug', courseController.getCourseBySlug);
courseRouter.post('/:instructorId', courseController.createCourse);
courseRouter.put('/:id', courseController.updateCourse);
courseRouter.delete('/:id', courseController.deleteCourse);

module.exports = courseRouter;