import mongoose from "mongoose";

const PersonalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    required: true
  },
  horasDisponibles: {
    type: Number,
    required: true   
  },
  salarioHora: {
    type: Number,
    required: true   
  }
});

export default mongoose.model("Personal", PersonalSchema);
