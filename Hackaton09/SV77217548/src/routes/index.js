const express = require('express');
const authRouter = require('./auth.routes');
const usersRouter = require('./users.routes');
const coursesRouter = require('./courses.routes');
const lessonsRouter = require('./lessons.routes');
const enrollmentsRouter = require('./enrollments.routes');
const commentsRouter = require('./comments.routes');
const {updateEnrollmentStatus} = require('../controllers/enrollments.controller');
const {authenticate, authorizeRoles} = require('../middlewares/auth');
const {asyncHandler} = require('../utils/async-handler');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/courses', coursesRouter);
router.use('/courses/:courseId/lessons', lessonsRouter);
router.use('/courses/:courseId/enrollments', enrollmentsRouter);
router.use('/lessons/:lessonId/comments', commentsRouter);
// Endpoint directo según el requisito PATCH /enrollments/:id/status
router.patch('/enrollments/:id/status', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(updateEnrollmentStatus));

module.exports = router;
