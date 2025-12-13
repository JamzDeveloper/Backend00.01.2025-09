const express = require('express');
const {enroll, updateEnrollmentStatus, listEnrollments} = require('../controllers/enrollments.controller');
const {asyncHandler} = require('../utils/async-handler');
const {authenticate, authorizeRoles} = require('../middlewares/auth');

const router = express.Router({mergeParams: true});

router.post('/', authenticate, authorizeRoles('admin', 'instructor', 'student'), asyncHandler(enroll));
router.patch('/:id/status', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(updateEnrollmentStatus));
router.get('/', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(listEnrollments));

module.exports = router;
