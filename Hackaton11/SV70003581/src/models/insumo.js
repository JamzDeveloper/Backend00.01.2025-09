import mongoose from "mongoose";

const InsumoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true }
});

const InsumoModel = mongoose.model("Insumo", InsumoSchema);
export { InsumoModel };