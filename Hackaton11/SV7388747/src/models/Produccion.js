const mongoose = require('mongoose');

const produccionSchema = new mongoose.Schema({
    cantidadArmarios: {
        type: Number,
        required: true,
        min: 1
    },
    fechaProduccion: {
        type: Date,
        default: Date.now
    },
    tablonesUsados: {
        type: Number,
        required: true
    },
    gomaUsada: {
        type: Number,
        required: true
    },
    horasUsadas: {
        type: Number,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Produccion', produccionSchema)