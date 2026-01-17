const router = require('express').Router();
const controller = require('../../controllers/users.controller');
const {asyncHandler, validateUser} = require('../../middlewares');

router.get('/', asyncHandler(controller.listUsers));
router.post('/', [validateUser.validateCreateUser], asyncHandler(controller.createUser));
router.get('/:id', asyncHandler(controller.getUserById));

module.exports = router;
