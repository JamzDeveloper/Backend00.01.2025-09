import "./database.js";

import { seedMateriaPrima } from "./services/materiaPrima.service.js";
import { seedInsumo } from "./services/insumo.service.js";
import { seedPersonal } from "./services/personal.service.js";

import { findProduction, seedProduction } from "./services/produccion.service.js";

const main = async () => {

  await seedMateriaPrima();
  await seedInsumo();
  await seedPersonal();

  await seedProduction();

  const dataProduction = await findProduction();  
  
  console.log(dataProduction[0].insumo);
  console.log(dataProduction[0].materiaPrima);
  console.log(dataProduction[0].personal);

};

main();