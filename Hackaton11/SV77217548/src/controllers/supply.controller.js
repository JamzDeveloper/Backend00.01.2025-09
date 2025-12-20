const Supply = require('../models/supply.model');

function httpError(status, message){
    const err = new Error(message);
    err.status = status;
    return err;
}

exports.createSupply = async(req, res) => {
    const supply = await Supply.create(req.body);
    res.status(201).json(supply);
};

exports.listSupplies = async(req, res) => {
    const filter = {};
    const {q, minStockKg} = req.query;
    if (q) filter.name = new RegExp(q, 'i');
    if (minStockKg !== undefined){
        const min = Number(minStockKg);
        if (!Number.isNaN(min)) filter.stockKg = {$gte: min};
    }
    const items = await Supply.find(filter).sort('-createdAt');
    res.json(items);
};

exports.getSupply = async(req, res) => {
    const supply = await Supply.findById(req.params.id);
    if (!supply) throw httpError(404, 'Supply not found');
    res.json(supply);
};

exports.updateSupply = async(req, res) => {
    const allowed = ['name', 'description', 'stockKg', 'unit'];
    const payload = {};
    for (const key of allowed){
        if (req.body[key] !== undefined) payload[key] = req.body[key];
    }
    const updated = await Supply.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updated) throw httpError(404, 'Supply not found');
    res.json(updated);
};

exports.deleteSupply = async(req, res) => {
    const deleted = await Supply.findByIdAndDelete(req.params.id);
    if (!deleted) throw httpError(404, 'Supply not found');
    res.status(204).send();
};

exports.purchaseSupply = async(req, res) => {
    const quantity = Number(req.body.quantity);
    if (!quantity || quantity <= 0) throw httpError(400, 'Quantity must be greater than zero');
    const updated = await Supply.findByIdAndUpdate(
        req.params.id,
        {$inc: {stockKg: quantity}},
        {new: true, runValidators: true}
    );
    if (!updated) throw httpError(404, 'Supply not found');
    res.json({message: 'Stock updated', supply: updated});
};