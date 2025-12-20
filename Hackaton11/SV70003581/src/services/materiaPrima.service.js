import { MateriaPrimaModel } from "../models/materiaPrima.js";

const arrayData = [
  {
    name: "madera",
    price: 100,
    quantity: 10,
    unit: "kg",
  },
  {
    name: "metal",
    price: 200,
    quantity: 20,
    unit: "kg",
  },
  {
    name: "plastico",
    price: 50,
    quantity: 30,
    unit: "kg",
  },
  {
    name: "vidrio",
    price: 150,
    quantity: 15,
    unit: "kg",
  },
  {
    name: "papel",
    price: 30,
    quantity: 25,
    unit: "kg",
  },
  {
    name: "tela",
    price: 80,
    quantity: 12,
    unit: "kg",
  },
  {
    name: "aluminio",
    price: 90,
    quantity: 22,
    unit: "kg",
  },
];

const seedMateriaPrima = async () => {

  const totalMateriaPrimaData = await MateriaPrimaModel.countDocuments();

  console.log("Total Materia Prima Data:", totalMateriaPrimaData);

  if (totalMateriaPrimaData > 0) return;

  await createSeed();
};

const createSeed = async () => {
  await MateriaPrimaModel.insertMany(arrayData);
};

export { seedMateriaPrima };