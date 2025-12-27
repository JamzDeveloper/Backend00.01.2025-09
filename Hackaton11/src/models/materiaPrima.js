import mongoose from "mongoose";

const MateriaPrimaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  //   proveedor: { type: String, required: true },
  //   fechaCompra: { type: Date, required: true },
  //   fechaVencimiento: { type: Date, required: true },
  //   estado: { type: String, required: true },
});

const MateriaPrimaModel = mongoose.model("MateriaPrima", MateriaPrimaSchema);
export { MateriaPrimaModel };