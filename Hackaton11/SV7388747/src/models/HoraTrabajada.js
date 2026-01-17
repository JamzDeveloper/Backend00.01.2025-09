const mongoose = require('mongoose');

const horaTrabajadaSchema = new mongoose.Schema({
    empleadoNombre: {
        type: String,
        required: true,
        trim: true
    },
    horasTrabajadas: {
        type: Number,
        required: true,
        min: 0
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

module.exports = mongoose.model('HoraTrabajada', horaTrabajadaSchema)