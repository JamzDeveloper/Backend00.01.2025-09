
// const dblocal = new DB();
// const dbsession = new sessionDB();



class Celular {
  constructor(propietario, numero, imei, marca, modelo, primeraInspeccion) {
    this.propietario = propietario;
    this.numero = numero;
    this.imei = imei;
    this.marca = marca;
    this.modelo = modelo;
    this.primeraInspeccion = primeraInspeccion
  }
}


// crear un objeto que reciba los datos del formulario cuando se presione el boton de guardar y llevarlo a la clase celular

const formData = {};

$("#btnEnviaringreso").on("click", function (e) {
  e.preventDefault();

  formData.propietario = $("#nombrePropietario").val();
  formData.numero = $("#numeroTelefono").val();
  formData.imei = $("#imei").val();
  formData.marca = $("#marca").val();
  formData.modelo = $("#modelo").val();
  formData.primeraInspeccion = $("#primeraInspeccion").val();

  const nuevoCelular = new Celular(
    formData.propietario,
    formData.numero,
    formData.imei,
    formData.marca,
    formData.modelo,
    formData.primeraInspeccion
  );

  console.log(nuevoCelular);

  dblocal.saveData("nuevoCelular", nuevoCelular);
  dbweb.saveData("nuevoCelular", nuevoCelular);
});

 


const formIngreso = (function () {
  let ingreso, salida;

  function eventos() {
    $("#btnEnviaringreso").on("click", function (e) {
      e.preventDefault(); // Prevenir el comportamiento por defecto del botón
      darIngreso();
      $("#divIngreso").hide()
    });
  }

  async function darIngreso() {
    const nombrePropietario = $("#nombrePropietario").val();
    const numeroTelefono = $("#numeroTelefono").val();
    const marca = $("#marca").val();
    const imei = $("#imei").val();
    const primeraInspeccion = $("#primeraInspeccion").val();
    const checkUser = $("#checkUser").val();
    $("#formStatus").show();

    $("#nombrePropietario2").val(nombrePropietario)
    $("#numeroTelefono2").val(numeroTelefono);
    $("#marca2").val(marca);
    $("#imei2").val(imei);
    $("#primeraInspeccion2").val(primeraInspeccion);

    $("#nombrePropietario3").val(nombrePropietario)
    $("#numeroTelefono3").val(numeroTelefono);
    $("#marca3").val(marca);
    $("#imei3").val(imei);
    $("#primeraInspeccion3").val(primeraInspeccion);

    // Crear la instancia del objeto aquí, con los parámetros en el orden correcto
    const vendedor = new Celular(nombrePropietario, numeroTelefono, imei, marca, primeraInspeccion);
    const tecnico = new Celular(nombrePropietario, numeroTelefono, imei, marca, primeraInspeccion);
    const cliente = new Celular(nombrePropietario, numeroTelefono, imei, marca, primeraInspeccion);

    vendedor.nombrePropietario = nombrePropietario
    cliente.nombrePropietario = tecnico.nombrePropietario = vendedor.nombrePropietario

    console.log(cliente.nombrePropietario)
    

  }

  eventos();
})();




 const arraySucursales = [];
// crea un array de ciudades y las agrega como opciones a un select de sucursales
$("#agregarBtn").on("click", (e)=>{
  e.preventDefault();
  const opciones = $("#sucursal").val();
  const nuevaOpcion = document.createElement("option");
  nuevaOpcion.value = opciones;
  nuevaOpcion.textContent = opciones;
  $("#sucursal2").append(nuevaOpcion);


  const nuevaSucursal = new Sucursal(opciones);
   arraySucursales.push(nuevaSucursal);
  console.log(arraySucursales);
})


function abrirForm() {
  $("#btnAbrirform").on("click", function () {
    $("#divIngreso").show()
  })
}

abrirForm()
