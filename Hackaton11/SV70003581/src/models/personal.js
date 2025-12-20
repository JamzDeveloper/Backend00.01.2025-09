import mongoose from "mongoose";

const PersonalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  weeklyHours: { type: Number, required: true },
  salary: { type: Number, required: true }
});

const PersonalModel = mongoose.model("Personal", PersonalSchema);
export { PersonalModel };