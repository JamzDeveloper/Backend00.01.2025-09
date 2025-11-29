const db = new DB();
const tecnoIdat = new Central();

const loadingSystem = () => {
  const branches = db.getData("sucursales");
  console.log("Branches loaded", branches);

  const arrayBranches = branches.map((branch) => {
    const newBranch = new Sucursal(
      branch.nombre,
      branch.direccion,
      branch.contacto,
      branch.central
    );
    return newBranch;
  });

  tecnoIdat.loadingBranches(arrayBranches);
};

const saveBranch = (system) => {
  console.log("saveBranch", system.sucursales);
  const branchesValues = system.sucursales.map((e) => e.toValue());
  console.log("branchesValues", branchesValues);

  db.saveData("sucursales", branchesValues);
};

const loadingBranches = (system) => {
  const optionItem = document.querySelector("#sucursal");
  let arrayOptions = [];
  const selectInitial = document.createElement("option");

  selectInitial.value = "no-option";
  selectInitial.textContent = "Seleccione una sucursal";
  arrayOptions.push(selectInitial);

  system.sucursales.forEach((element) => {
    const optionItem = document.createElement("option");
    optionItem.value = element.nombre;
    optionItem.textContent = element.nombre;
    arrayOptions.push(optionItem);
  });

  optionItem.replaceChildren(...arrayOptions);
};



// const tecnoIdatTrujillo = new Sucursal(
//     "Tecno-trujillo",
//     "trujillo",
//     "967567567",
//     tecnoIdat
// )
// tecnoIdat.agregarSucursal(tecnoIdatTrujillo)

// console.log("TecnoIdat before saving", tecnoIdat.sucursales);
// saveBranch(tecnoIdat);

loadingSystem();
loadingBranches(tecnoIdat)
console.log("TecnoIdat  loading", tecnoIdat.sucursales);
