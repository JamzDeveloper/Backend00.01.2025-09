import { MateriaPrimaModel } from "../models/materiaPrima.js";
import { InsumoModel } from "../models/insumo.js";
import { PersonalModel } from "../models/personal.js";

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
    insumo: [
      { insumoId: "", quantity: 10 },
      { insumoId: "", quantity: 5 },
    ],
    personal: [
      { personalId: "", hours: 8 },
      { personalId: "", hours: 6 },
    ]
  },
  {
    product: "mesa",
    quantityOfProduction: 50,
    dateOfProduction: new Date(),
    materiaPrima: [
      { materiaPrimaId: "", quantity: 48 },
      { materiaPrimaId: "", quantity: 20 },
    ],
    insumo: [
      { insumoId: "", quantity: 8 },
      { insumoId: "", quantity: 4 },
    ],
    personal: [
      { personalId: "", hours: 10 },
      { personalId: "", hours: 7 },
    ]
  },
];

const seedProduction = async () => {
  const totalProductionData = await ProduccionModel.countDocuments();

  console.log("Total Production Data: ",totalProductionData);
  if (totalProductionData > 0) return;

  await createSeed();
};

const createSeed = async () => {
  
  const materiaPrimaFind = await MateriaPrimaModel.find();
  const insumoFind = await InsumoModel.find();
  const personalFind = await PersonalModel.find();

  console.log("1");
  console.log(materiaPrimaFind);
  console.log("2");
  console.log(insumoFind);
  console.log("3");
  console.log(personalFind);
  console.log("4");

  if (!materiaPrimaFind || materiaPrimaFind.length == 0) return;
  if (!insumoFind || insumoFind.length == 0) return;
  if (!personalFind || personalFind.length == 0) return;

  const dataInsert = productionData.map((val) => {
    return {
      ...val,

      materiaPrima: val.materiaPrima.map((val2) => {
        const randomId = Math.floor(Math.random() * materiaPrimaFind.length);
        const materiaPrima = materiaPrimaFind[randomId]._id;

        return { ...val2, materiaPrimaId: materiaPrima };
      }),

      insumo: val.insumo.map((val3) => {
        const randomId = Math.floor(Math.random() * insumoFind.length);
        const insumo = insumoFind[randomId]._id;

        return { ...val3, insumoId: insumo };
      }),

      personal: val.personal.map((val4) => {
        const randomId = Math.floor(Math.random() * personalFind.length);
        const personal = personalFind[randomId]._id;

        return { ...val4, personalId: personal };
      }),

    };
  });

  await ProduccionModel.insertMany(dataInsert);
};

const findProduction = async () => {
  const data = await ProduccionModel.find()
    .populate("materiaPrima.materiaPrimaId")    
    .populate("personal.personalId")
    .populate("insumo.insumoId");
  return data;
};
export { seedProduction, findProduction };