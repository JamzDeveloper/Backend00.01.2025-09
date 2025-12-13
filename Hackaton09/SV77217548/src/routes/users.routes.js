const express = require('express');
const {createUser, listUsers}= require('../controllers/users.controller');
const {asyncHandler} = require('../utils/async-handler');
const {authenticate, authorizeRoles} = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin'), asyncHandler(createUser));
router.get('/', authenticate, authorizeRoles('admin', 'instructor'), asyncHandler(listUsers));

module.exports = router;
