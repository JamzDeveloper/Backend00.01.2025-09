import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: {
        type: String, 
        default: "" 
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    },
    esCompletado: { 
        type: Boolean, 
        default: false 
    }
});

export default mongoose.model("Item", ItemSchema);