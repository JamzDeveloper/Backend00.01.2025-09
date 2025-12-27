const {validateUser, async} = require("../middlewares");

const controller = require('../controllers/user.controller')

const router = require("express").Router();



router.post("/",[validateUser.validateCreateUser, validateUser.validateAccess],async(controller.createUser));


module.exports = router;