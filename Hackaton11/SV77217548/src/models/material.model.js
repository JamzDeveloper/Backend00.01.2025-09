const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, unique: true},
    description: {type: String, trim: true, default: ''},
    stock: {type: Number, required: true, min: 0, default: 0},
    unit: {type: String, default: 'unidad', trim: true},
},{timestamps: true});

module.exports = mongoose.model('Material', MaterialSchema);
