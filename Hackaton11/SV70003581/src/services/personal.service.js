import { PersonalModel } from "../models/personal.js";

const arrayData = [
  {
    name: "Mauro Samaniego",
    occupation: "master carpenter",
    weeklyHours: 48,
    salary: 3000,
  },
  {
    name: "Juan Bustamante",
    occupation: "lead carpenter",
    weeklyHours: 48,
    salary: 2500,
  },
  {
    name: "Sebastián Jaramillo",
    occupation: "carpenter",
    weeklyHours: 48,
    salary: 1800,
  },
  {
    name: "Luis Cisneros",
    occupation: "carpenter",
    weeklyHours: 24,
    salary: 800,
  },
  {
    name: "Paola Navarrete",
    occupation: "wood finisher",
    weeklyHours: 48,
    salary: 2000,
  }
];

const seedPersonal = async () => {

  const totalPersonalData = await PersonalModel.countDocuments();

  console.log("Total Personal Data:", totalPersonalData);

  if (totalPersonalData > 0) return;

  await createSeed();
};

const createSeed = async () => {
  await PersonalModel.insertMany(arrayData);
};

export { seedPersonal };