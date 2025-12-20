import mongoose from "mongoose";

const ProduccionSchema = new mongoose.Schema({
  producto: {
    type: String,
    default: "Armario"
  },
  tablon: {
    type: Number,
    default: 1
  },
  gomaKg: {
    type: Number,
    default: 0.25
  },
  horasHombre: {
    type: Number,
    default: 8
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Produccion", ProduccionSchema);