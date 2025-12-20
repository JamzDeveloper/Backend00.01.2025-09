const Employee = require('../models/employee.model');

function httpError(status, message){
    const err = new Error(message);
    err.status = status;
    return err;
}

exports.createEmployee = async(req, res) => {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
};

exports.listEmployees = async(req, res) => {
    const filter = {};
    const {q, minHours} = req.query;
    if (q) filter.name = new RegExp(q, 'i');
    if (minHours !== undefined){
        const min = Number(minHours);
        if (!Number.isNaN(min)) filter.availableHours = {$gte: min};
    }
    const items = await Employee.find(filter).sort('-createdAt');
    res.json(items);
};

exports.getEmployee = async(req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) throw httpError(404, 'Employee not found');
    res.json(employee);
};

exports.updateEmployee = async(req, res) => {
    const allowed = ['name', 'role', 'availableHours', 'hourlyRate'];
    const payload = {};
    for (const key of allowed){
        if (req.body[key] !== undefined) payload[key] = req.body[key];
    }
    const updated = await Employee.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updated) throw httpError(404, 'Employee not found');
    res.json(updated);
};

exports.deleteEmployee = async(req, res) => {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) throw httpError(404, 'Employee not found');
    res.status(204).send();
};

exports.registerWorkHours = async(req, res) => {
    const hours = Number(req.body.hours);
    if (!hours || hours <= 0) throw httpError(400, 'Hours must be greater than zero');

    const employee = await Employee.findById(req.params.id);
    if (!employee) throw httpError(404, 'Employee not found');

    if (employee.availableHours < hours){
        throw httpError(409, 'Not enough available hours');
    }

    employee.availableHours -= hours;
    await employee.save();

    res.json({message: 'Hours consumed', employee});
};

