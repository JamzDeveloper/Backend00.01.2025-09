import { MateriaPrimaModel } from "../models/materiaPrima.js";
import { ProduccionModel } from "../models/produccion.js";

const productionData = [
  {
    product: "silla",
    quantityOfProduction: 50,
    dateOfProduction: new Date(),
    materiaPrima: [
      { materiaPrimaId: "", quantity: 48 },
      { materiaPrimaId: "", quantity: 20 },
    ],
  },
  {
    product: "mesa",
    quantityOfProduction: 50,
    dateOfProduction: new Date(),
    materiaPrima: [
      { materiaPrimaId: "", quantity: 48 },
      { materiaPrimaId: "", quantity: 20 },
    ],
  },
];
const seedProduction = async () => {
  const totalProductionData = await ProduccionModel.countDocuments();

  console.log(totalProductionData);
  if (totalProductionData > 0) return;

  await createSeed();
};

const createSeed = async () => {
  const materiaPrimaFind = await MateriaPrimaModel.find();

  console.log(materiaPrimaFind);

  if (!materiaPrimaFind || materiaPrimaFind.length == 0) return;
  const dataInsert = productionData.map((val) => {
    return {
      ...val,
      materiaPrima: val.materiaPrima.map((val2) => {
        const randomId = Math.floor(Math.random() * materiaPrimaFind.length);
        const materiaPrima = materiaPrimaFind[randomId]._id;

        return { ...val2, materiaPrimaId: materiaPrima };
      }),
    };
  });

  await ProduccionModel.insertMany(dataInsert);
};

const findProduction = async () => {
  const data = await ProduccionModel.find().populate(
    "materiaPrima.materiaPrimaId"
  );
  return data;
};
export { seedProduction, findProduction };
