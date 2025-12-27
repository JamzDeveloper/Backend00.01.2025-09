import mongoose from "mongoose";
import { MateriaPrimaModel } from "./materiaPrima.js";

const materiaProduction = new mongoose.Schema({
  materiaPrimaId: { type: mongoose.Types.ObjectId, ref: MateriaPrimaModel },
  quantity: { type: Number, required: true },
});

const produccionSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantityOfProduction: { type: Number, required: true },
  dateOfProduction: { type: Date, required: true },
  materiaPrima: [materiaProduction],
  //personal
  //insumos
});

/*
materiaprima:[
    {materiaPrimaId: '693dcef4ae609045e65fedc3',quantity:48}
]
'693dcef4ae609045e65fedc3',\\\*/

const ProduccionModel = mongoose.model("Produccion", produccionSchema);

export { ProduccionModel };