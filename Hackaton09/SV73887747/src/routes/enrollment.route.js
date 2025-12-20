const express = require('express');
const enrollmentRouter = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');

enrollmentRouter.post('/:courseId', enrollmentController.enrollUser);

module.exports = enrollmentRouter;