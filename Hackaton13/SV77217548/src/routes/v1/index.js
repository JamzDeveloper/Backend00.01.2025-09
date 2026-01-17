const router = require('express').Router();

router.use('/users', require('./users.route'));
router.use('/orders', require('./orders.route'));
router.use('/uploads', require('./uploads.route'));
router.use('/payments', require('./payments.route'));

module.exports = router;
