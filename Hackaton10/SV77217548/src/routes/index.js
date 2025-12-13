const express = require('express');
const listasRouter = require('./listas.routes');
const authRouter = require('./auth.routes');

const router = express.Router();

router.use('/listas', listasRouter);
router.use('/auth', authRouter);

module.exports = router;
