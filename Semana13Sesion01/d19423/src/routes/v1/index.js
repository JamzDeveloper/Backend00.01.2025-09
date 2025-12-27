const router = require('express').Router();

router.use('/user', require('./user.route'));
router.use('/order', require('./order.route'));

module.exports = router;