


$("#btnPagar").hide()
$("#Range").hide();
$("#btnReparado").hide();

// Clase Celular
class Celular {
    constructor(IMEI, numeroSerie, marca, modelo, problema) {
        // this.propietario = propietario;
        this.IMEI = IMEI;
        this.numeroSerie = numeroSerie;
        this.marca = marca;
        this.modelo = modelo;
        this.problema = problema;
    }
}

// Variable global para almacenar los datos del celular
let formValues = {};
let result = {};
let formData = {};
let pago = {};  // Variable global para el pago

$("#btnContinuar").on("click", async function (e) {
    e.preventDefault();

    console.log("Hizo click");
    $("#divReserva").hide();

    const result = await Swal.fire({
        title: "Ingresa los datos",
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        html: `<!-- Text input-->
<div class="form-group">
<div >
<input id="IMEI" name="IMEI" type="text" placeholder="Ingrese el IMEI" class="form-control input-md">
</div>
</div>

<!-- Text input-->
<div class="form-group">
<div >
<input id="numeroSerie" name="numeroSerie" type="text" placeholder="Ingrese el número de serie" class="form-control input-md">
</div>
</div>
`,
        preConfirm: () => {
            return {
                IMEI: $("#IMEI").val(),
                numeroSerie: $("#numeroSerie").val(),
            }
        }
    })

    // Verificar que el usuario confirmó (no canceló)
    if (!result.isConfirmed) {
        console.log("Usuario canceló el modal");
        return;
    }

    // Asignar a la variable global
    formValues = result.value;

    if (formValues.IMEI === "123456789") {
        Swal.fire("IMEI robado detectado");
        return;
    }
    // console.log(formValues.IMEI);

    // await registrarCelular();

    // <----------------------
    await registrarCelular();

    // <----------------------


    console.log("Datos completos del celular:", formValues);
});
// <----------------------------------------------------------------------------------







// <----------------------
async function guardar() {
    const ok = await Swal.fire({
        title: "¿Guardar cambios?",
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
    });
    if (ok.isConfirmed) {
        // Crear una instancia de Celular con los datos de formValues
        const celularRegistrado = new Celular(
            formValues.IMEI,
            formValues.numeroSerie,
            formValues.marca,                              // marca
            formValues.modelo,                             // modelo
            formValues.problema || ""                      // problema
        );

        // Asignar la instancia a formValues
        formValues = celularRegistrado;

        await Swal.fire("Guardado", "Los cambios fueron aplicados", "success");

        // Llamar mostrarDatos AQUÍ, después de guardar
        mostrarDatos();
        console.log(formData);
    }
}
// <----------------------


// <----------------------
async function registrarCelular() {
    const result = await Swal.fire({
        title: "Ingresa los datos",
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        html: `<!-- Text input-->
<div class="form-group">
<div >
<input id="marca" name="marca" type="text" placeholder="Ingrese la marca" class="form-control input-md">
</div>
</div>

<!-- Text input-->
<div class="form-group">
<div >
<input id="modelo" name="modelo" type="text" placeholder="Ingrese el modelo" class="form-control input-md">
</div>
</div>

<div class="form-group">
<div >
<input id="problema" name="problema" type="text" placeholder="Ingrese el problema" class="form-control input-md">
</div>
</div>

`,
        preConfirm: () => {
            return {
                marca: $("#marca").val(),
                modelo: $("#modelo").val(),
                problema: $("#problema").val(),
            }
        }
    })

    // Verificar que el usuario confirmó
    if (!result.isConfirmed) {
        console.log("Usuario canceló registrarCelular");
        return;
    }

    await guardar();

    // Agregar los datos del celular a la variable global
    formValues = { ...formValues, ...result.value };
    formData = { ...formData, ...formValues }
    console.log("formData completo:", formValues.IMEI);
    mostrarDatos();

}
// <----------------------


function mostrarDatos() {
    $("#mostrarIMEI").val(formData.IMEI)
    $("#mostrarNumeroSerie").val(formData.numeroSerie)
    $("#mostrarMarca").val(formData.marca)
    $("#mostrarModelo").val(formData.modelo)
    $("#mostrarProblema").val(formData.problema)
}

// Función para pagar la mitad (fuera del evento)
async function pagarMitad() {
    pago = await Swal.fire({
        title: "¿Desea pagar la mitad ahora?",
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Sí, pagar",
        cancelButtonText: "Cancelar",
    });

    if (pago.isConfirmed) {
        await Swal.fire("Pago realizado", "Se registró el pago de la mitad", "success");
        console.log("Pago confirmado:", pago);
        console.log("Objeto pago global:", pago);
        $("#Range").show();
        // Aquí puedes agregar más lógica de pago
    } else {
        console.log("Usuario canceló el pago:", pago);
    }
}

$("#btnDiagnostico").on("click", function (e) {
    e.preventDefault();
    const diagnostico = $("#diagnostico").val();
    console.log("Diagnostico enviado:", diagnostico);
    formData.diagnostico = diagnostico;
    Swal.fire("Diagnostico enviado correctamente");

    // Mostrar el diagnóstico en el campo correspondiente
    $("#clienteDiagnostico").val(formData.diagnostico);
    $("#btnPagar").show();
    // Llamar pagarMitad cuando se envíe el diagnóstico
    
});

$("#btnPagar").on("click", function (e) {
    e.preventDefault();
    pagarMitad();
});




$("#range3").on("input change", function () {
  const valor = Number($(this).val());   // convertir a number
  console.log("Valor range3:", valor);

  if (valor === 5) {
    $("#btnReparado").show();
        $("#btnReparado").on("click", function (e) {
        e.preventDefault();
        const avance = $("#range3").val();
        console.log("Avance de reparación:", avance);
        formData.avanceReparacion = avance;
        Swal.fire("Avance registrado correctamente");
        localStorage.setItem('Celular', JSON.stringify(formData));
    });
  } else {
    $("#btnReparado").hide();
  }
});