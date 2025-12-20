const router = require('express').Router();
const controller = require('../controllers/employee.controller');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(controller.listEmployees));
router.get('/:id', asyncHandler(controller.getEmployee));
router.post('/', asyncHandler(controller.createEmployee));
router.patch('/:id', asyncHandler(controller.updateEmployee));
router.delete('/:id', asyncHandler(controller.deleteEmployee));
router.post('/:id/register-hours', asyncHandler(controller.registerWorkHours));

module.exports = router;
