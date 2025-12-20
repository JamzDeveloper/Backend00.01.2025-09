const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    role: {type: String, trim: true, default: 'operario'},
    availableHours: {type: Number, required: true, min: 0, default: 0},
    hourlyRate: {type: Number, min: 0, default: 0},
}, {timestamps: true});

module.exports = mongoose.model('Employee', EmployeeSchema);
