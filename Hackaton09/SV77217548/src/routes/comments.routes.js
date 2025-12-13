const express = require('express');
const {createComment, listComments} = require('../controllers/comments.controller');
const {asyncHandler} = require('../utils/async-handler');
const {authenticate, authorizeRoles} = require('../middlewares/auth');

const router = express.Router({mergeParams: true});

router.post('/', authenticate, authorizeRoles('admin', 'instructor', 'student'), asyncHandler(createComment));
router.get('/', asyncHandler(listComments));

module.exports = router;
