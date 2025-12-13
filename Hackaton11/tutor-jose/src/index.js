import "./database.js";
import { seedMateriaPrima } from "./services/materiaPrima.service.js";
import {
  findProduction,
  seedProduction,
} from "./services/produccion.service.js";

const main = async () => {
  await seedMateriaPrima();

  await seedProduction();

  const dataProduction = await findProduction();

  console.log(dataProduction[0].materiaPrima);
};

main();
