


const Reserva = (function () {
    let txtPais, txtNombre;

    function configurar(){
        $("#txtPais").text(txtPais);
        // document.getElementById("txtPais").innerText = txtPais;
        $("#txtNombre").text(txtNombre);
    }
    function eventos(){
        $("#btnReservar").on("click",reservar);
        // document.getElementById("btnReservar").addEventListener("click",(e)=>{
    }

    async function reservar(e){
        e.preventDefault();
        console.log("Hizo click");
        $("#divReserva").hide();
        const {value: formValues} = await Swal.fire({
            title: "Ingresa los datos",
            icon: "info",
            showCloseButton: true,
            showCancelButton : true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            html: `<!-- Text input-->
<div class="form-group">
<div >
<input id="origen" name="origen" type="text" placeholder="Escribe el origen del vuelo" class="form-control input-md">
</div>
</div>

<!-- Text input-->
<div class="form-group">
<div >
<input id="destino" name="destino" type="text" placeholder="Escribe el destino de tu vuelo " class="form-control input-md">
</div>
</div>

<!-- Text input-->
<div class="form-group">
<div >
<input id="fechaIda" name="fechaIda" type="text" placeholder="Escribe la Fecha de Ida" class="form-control input-md">
</div>
</div>

<!-- Text input-->
<div class="form-group">
<div >
<input id="fechaVuelta" name="fechaVuelta" type="text" placeholder="Escribe la fecha de retorno" class="form-control input-md">
</div>
</div>`,
            preConfirm:()=>{
                
                return{
                    origen: $("#origen").val(),
                    destino : $("#destino").val(),
                    fechaIda: $("#fechaIda").val(),
                    fechaVuelta: $("#fechaVuelta").val(),   
                }
            }
        })
        console.log(formValues);
        if(formValues){
            let objReserva = new Reservas(formValues.origen, formValues.destino, formValues.fechaIda, formValues.fechaVuelta);
            objReserva.asignarAvionIda(new Aviones("PE702", "Airbus 320Neo",180, 90, 5000))
            objReserva.asignarAvionVuelta(new Aviones("PE891", "Airbus 320Neo", 150, 75, 8000));
            incluirPasajeros().then(data=>{
                console.log(data);
                objReserva.avionIda.agregarPasajero(data);
                objReserva.avionVuelta.agregarPasajero(data);
                dibujarCheckout(objReserva);
            }).catch(err=>{
                console.log(err)
            })
            console.log(objReserva)
            
        }
    }

    function dibujarCheckout(obj){
        $("#idaNombre").val(obj.avionIda.arrPasajeros[0].nombres);
        $("#idaApellido").val(obj.avionIda.arrPasajeros[0].apellidos);
        $("#idaFecha").val(obj.fechaIda);
        $("#idaVuelo").val(obj.avionIda.matricula);
        $("#idaOrigen").val(obj.origen);
        // $("#").val(obj);
        // $("#").val(obj);
        // $("#").val(obj);fun
        // $("#").val(obj);
        // $("#").val(obj);

        $("#divReserva").show();

    }
   async function incluirPasajeros(){
    const {value: formValues} = await Swal.fire({
            title: "Ingresa los datos",
            icon: "info",
            showCloseButton: true,
            showCancelButton : true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            html: `<!-- Text input-->
<div class="form-group">
<div >
<input id="nombres" name="nombres" type="text" placeholder="Escribe los nombres del pasajero" class="form-control input-md">
</div>
</div>

<!-- Text input-->
<div class="form-group">
<div >
<input id="apellidos" name="apellidos" type="text" placeholder="Escribe los apellidos del pasajero " class="form-control input-md">
</div>
</div>

<!-- Text input-->
<div class="form-group">
<div >
<input id="documento" name="documento" type="text" placeholder="Escribe tu documento" class="form-control input-md">
</div>
</div>


</div>
`,
            preConfirm:()=>{
                
                return{
                    nombres: $("#nombres").val(),
                    apellidos : $("#apellidos").val(),
                    dni: $("#documento").val()
                }
            }
        })
        console.log(formValues);
        if(formValues){
            let objPasajero = new Cliente(formValues.dni,formValues.nombres,formValues.apellidos,"","","" )
            return objPasajero;
        }
   }
    return {
        init: function(parametros){
            txtNombre = parametros.nombre;
            txtPais = parametros.pais;
            configurar();
            eventos();
        }
    }
})();

class Persona{
    #isLogged = false;
    constructor(dni, nombres, apellidos,direccion, telefono){
        this.dni = dni;
        this.nombres= nombres;
        this.apellidos=apellidos;
        this.direccion = direccion;
        this.telefono = telefono;
    }
    getLogged(){
        return this.#isLogged;
    }
    setLogged(newLog){
        if(this.#isLogged && newLog){
            return "Ya tienes iniciada la sesion";
        }
        else{
        if(newLog){
            this.#isLogged = newLog;
            return "haz iniciado tu sesion correctamente"
        }
        else{
            this.#isLogged = newLog;
            return "haz cerrado tu sesion correctamente"
        }
    }
    }

    login(){
       console.log( this.setLogged(true));

        
    }
    logout(){
        console.log( this.setLogged(false));
    }
}

// let objPersona = new Persona("123515","Roberto","Pineda", "Lima", 916730940);

// objPersona.login();

// objPersona.login();

// objPersona.logout();

// objPersona.login();

class Empleado extends Persona{
    constructor(dni, nombre, apellidos,direccion, telefono, idEmpleado){
        super(dni, nombre, apellidos,direccion, telefono);
        this.idEmpleado = idEmpleado;
    }
    cobrar(cliente, medioPago, monto){
        console.log(`El cliente ${cliente.nombre} ${cliente.apellidos} esta pagando ${monto} con ${medioPago}`);
    }
}

class Cliente extends Persona{
    constructor(dni, nombres, apellidos,direccion, telefono, idCliente){
        super(dni, nombres, apellidos,direccion, telefono);
        this.idCliente = idCliente;
    }
    pagar(medioPago){
        console.log(`El cliente ${this.nombre} ${this.apellidos} esta pagando con ${medioPago}`);
    }

}

class Aviones{
    constructor(matricula, modelo, nroAsientos, capacidadMinima, costoVuelo){
        this.matricula = matricula;
        this.modelo = modelo;
        this.nroAsientos= nroAsientos;
        this.capacidadMinima = capacidadMinima;
        this.costoVuelo = costoVuelo;

        this.arrPasajeros = [];
        this.habilitado = false;
        this.reservado = 0;
    }

    agregarPasajero(pasajero){
        if(this.reservado >= this.capacidadMinima){
            this.habilitado = true;
        }
        else{
            this.habilitado = false;
        }
        this.arrPasajeros.push(pasajero);
        this.reservado ++;
    }
}

class Reservas{
    constructor(origen, destino, fechaIda, fechaVuelta){
        this.origen = origen;
        this.destino = destino;
        this.fechaIda = fechaIda;
        this.fechaVuelta = fechaVuelta;

        this.avionIda = null;
        this.avionVuelta = null;
    }
    asignarAvionIda(avion){
        this.avionIda = avion;
    }
    asignarAvionVuelta(avion){
        this.avionVuelta = avion;
    }
}
