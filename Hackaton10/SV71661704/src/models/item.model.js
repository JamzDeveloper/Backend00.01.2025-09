import mongoose, { Schema, Types } from "mongoose";

//Nombre, Descripcion, Fecha, EsCompletado
const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  date: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const ItemModel = mongoose.model("items", ItemSchema);

export { ItemModel };