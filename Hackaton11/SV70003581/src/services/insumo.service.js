import { InsumoModel } from "../models/insumo.js";

const arrayData = [
  {
    name: "cola",
    price: 100,
    quantity: 10,
    unit: "kg",
  },
  {
    name: "terokal",
    price: 200,
    quantity: 20,
    unit: "kg",
  },
  {
    name: "felpa para patas",
    price: 50,
    quantity: 30,
    unit: "unidad",
  },
  {
    name: "antideslizante",
    price: 150,
    quantity: 15,
    unit: "unidad",
  },
  {
    name: "papel tapiz",
    price: 30,
    quantity: 25,
    unit: "ml",
  },
  {
    name: "esquinero",
    price: 80,
    quantity: 12,
    unit: "unidad",
  },
  {
    name: "pegatina",
    price: 90,
    quantity: 22,
    unit: "unidad",
  },
];

const seedInsumo = async () => {

  const totalInsumoData = await InsumoModel.countDocuments();

  console.log("Total Insumo Data:", totalInsumoData);

  if (totalInsumoData > 0) return;

  await createSeed();
};

const createSeed = async () => {
  await InsumoModel.insertMany(arrayData);
};

export { seedInsumo };