import mongoose from "mongoose";
import { MateriaPrimaModel } from "./materiaPrima.js";
import { InsumoModel } from "./insumo.js";
import { PersonalModel } from "./personal.js";

const materiaProduction = new mongoose.Schema({
  materiaPrimaId: { type: mongoose.Types.ObjectId, ref: MateriaPrimaModel },
  quantity: { type: Number, required: true },
});

const insumoProduccion = new mongoose.Schema({
  insumoId: { type: mongoose.Types.ObjectId, ref: InsumoModel },
  quantity: { type: Number, required: true },
});

const personalProduccion = new mongoose.Schema({
  personalId: { type: mongoose.Types.ObjectId, ref: PersonalModel },
  hours: { type: Number, required: true },
});

const produccionSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantityOfProduction: { type: Number, required: true },
  dateOfProduction: { type: Date, required: true },
  materiaPrima: [materiaProduction],
  insumo: [insumoProduccion],
  personal: [personalProduccion]  
});

const ProduccionModel = mongoose.model("Produccion", produccionSchema);

export { ProduccionModel };