const Material = require('../models/material.model');

function httpError(status, message){
    const err = new Error(message);
    err.status = status;
    return err;
}

exports.createMaterial = async(req, res) => {
    const material = await Material.create(req.body);
    res.status(201).json(material);
};

exports.listMaterials = async(req, res) => {
    const filter = {};
    const {q, minStock} = req.query;
    if (q) filter.name = new RegExp(q, 'i');
    if (minStock !== undefined){
        const min = Number(minStock);
        if (!Number.isNaN(min)) filter.stock = {$gte: min};
    }
    const items = await Material.find(filter).sort('-createdAt');
    res.json(items);
};

exports.getMaterial = async(req, res) => {
    const material = await Material.findById(req.params.id);
    if (!material) throw httpError(404, 'Material not found');
    res.json(material);
};

exports.updateMaterial = async(req, res) => {
    const allowed = ['name', 'description', 'stock', 'unit'];
    const payload = {};
    for (const key of allowed){
        if (req.body[key] !== undefined) payload[key] = req.body[key];
    }
    const updated = await Material.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updated) throw httpError(404, 'Material not found');
    res.json(updated);
};

exports.deleteMaterial = async(req, res) => {
    const deleted = await Material.findByIdAndDelete(req.params.id);
    if (!deleted) throw httpError(404, 'Material not found');
    res.status(204).send();
};

exports.purchaseMaterial = async(req, res) => {
    const quantity = Number(req.body.quantity);
    if (!quantity || quantity <= 0) throw httpError(400, 'Quantity must be greater than zero');
    const updated = await Material.findByIdAndUpdate(
        req.params.id,
        {$inc: {stock: quantity}},
        {new: true, runValidators: true}
    );
    if (!updated) throw httpError(404, 'Material not found');
    res.json({message: 'Stock updated', material: updated});
};
