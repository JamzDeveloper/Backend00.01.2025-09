import mongoose from "mongoose";

const MateriaPrimaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    costoUnitario: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("MateriaPrima", MateriaPrimaSchema);