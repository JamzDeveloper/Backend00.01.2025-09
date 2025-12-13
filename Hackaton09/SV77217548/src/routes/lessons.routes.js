const express = require('express');
const {createLesson, listLessons, updateLesson, deleteLesson, restoreLesson} = require('../controllers/lessons.controller');
const {asyncHandler} = require('../utils/async-handler');
const {authenticate, authorizeRoles} = require('../middlewares/auth');

const router = express.Router({mergeParams: true}); // Para poder acceder a los parametros del router padre con mergeParams

router.post('/', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(createLesson));
router.get('/', asyncHandler(listLessons));
router.put('/:id', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(updateLesson));
router.delete('/:id', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(deleteLesson));
router.post('/:id/restore', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(restoreLesson));

module.exports = router;
