const Production = require('../models/production.model');
const Material = require('../models/material.model');
const Supply = require('../models/supply.model');
const Employee = require('../models/employee.model');

const RECIPE = {
    boardsPerCabinet: 1,
    glueKgPerCabinet: 0.25,
    hoursPerCabinet: 8,
};

function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

exports.listProductions = async(req, res) => {
    const items = await Production.find()
        .sort('-createdAt')
        .populate('material', 'name unit')
        .populate('supply', 'name unit')
        .populate('employee', 'name role');
    res.json(items);
};

exports.getProduction = async(req, res) => {
    const production = await Production.findById(req.params.id)
        .populate('material', 'name unit')
        .populate('supply', 'name unit')
        .populate('employee', 'name role');
    if (!production) throw httpError(404, 'Production not found');
    res.json(production);
};

exports.createProduction = async(req, res) => {
    const quantity = Number(req.body.quantity ?? 1);
    const {materialId, supplyId, employeeId, notes} = req.body;

    if (!materialId || !supplyId || !employeeId){
        throw httpError(400, 'materialId, supplyId and employeeId are required');
    }
    if (!Number.isFinite(quantity) || quantity < 1) throw httpError(400, 'Quantity must be at least 1');

    const [material, supply, employee] = await Promise.all([
        Material.findById(materialId),
        Supply.findById(supplyId),
        Employee.findById(employeeId),
    ]);

    if (!material) throw httpError(404, 'Material not found');
    if (!supply) throw httpError(404, 'Supply not found');
    if (!employee) throw httpError(404, 'Employee not found');

    const boardsNeeded = quantity * RECIPE.boardsPerCabinet;
    const glueNeeded = quantity * RECIPE.glueKgPerCabinet;
    const hoursNeeded = quantity * RECIPE.hoursPerCabinet;

    if (material.stock < boardsNeeded) throw httpError(409, 'Not enough material stock');
    if (supply.stockKg < glueNeeded) throw httpError(409, 'Not enough supply stock');
    if (employee.availableHours < hoursNeeded) throw httpError(409, 'Not enough available hours');

    material.stock -= boardsNeeded;
    supply.stockKg -= glueNeeded;
    employee.availableHours -= hoursNeeded;

    await Promise.all([material.save(), supply.save(), employee.save()]);

    const production = await Production.create({
        quantity,
        material: material._id,
        supply: supply._id,
        employee: employee._id,
        boardsUsed: boardsNeeded,
        glueUsedKg: glueNeeded,
        hoursUsed: hoursNeeded,
        notes: notes || '',
    });

    res.status(201).json(production);
};