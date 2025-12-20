const mongoose = require('mongoose');

const ProductionSchema = new mongoose.Schema({
    product: {type: String, default: 'armario'},
    quantity: {type: Number, required: true, min: 1},
    material: {type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true},
    supply: {type: mongoose.Schema.Types.ObjectId, ref: 'Supply', required: true},
    employee: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true},
    boardsUsed: {type: Number, required: true, min: 0},
    glueUsedKg: {type: Number, required: true, min: 0},
    hoursUsed: {type: Number, required: true, min: 0},
    status: {type: String, enum: ['completed', 'failed'], default: 'completed'},
    notes: {type: String, trim: true, default: ''},
}, {timestamps: true});

module.exports = mongoose.model('Production', ProductionSchema);
