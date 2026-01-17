const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cantidadComprada: {
        type: Number,
        required: true,
        min: 0
    },
    unidad: {
        type: String,
        default: "kg"
    },
    fechaComprada: {
        type: Date,
        default: Date.now
    },
}, {timestamps: true});

module.exports = mongoose.model('Insumo', insumoSchema)