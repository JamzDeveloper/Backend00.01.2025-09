const mongoose = require('mongoose');

const SupplySchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, unique: true},
    description: {type: String, trim: true, default: ''},
    stockKg: {type: Number, required: true, min: 0, default: 0},
    unit: {type: String, default: 'kg', trim: true},
}, {timestamps: true});

module.exports = mongoose.model('Supply', SupplySchema);
