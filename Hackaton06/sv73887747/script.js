class Telefono {
    constructor(marca, modelo, serie, imei){
        this.marca = marca;
        this.modelo = modelo;
        this.serie = serie;
        this.imei = imei;
    }
}

class Cliente{
    constructor(dni, nombres, apellidos){
        this.dni = dni;
        this.nombres = nombres;
        this.apellidos = apellidos;
    }
}

class Tecnico{
    constructor(nombre, skills){
        this.nombre = nombre;
        this.skills = skills;
    }
    tieneSkill(marca){
        return this.skills.includes(marca);
    }
}

class Reparacion{
    constructor(telefono, cliente, diagnostico, abono, tecnico){
        this.telefono = telefono;
        this.cliente = cliente;
        this.diagnostico = diagnostico;
        this.abono = abono;
        this.tecnico = tecnico;
        this.repuestos = [];
        this.estado = "Iniciado";
    }
    agregarRepuesto(rep){
        this.repuestos.push(rep);
    }
    cambiarEstado(nuevo){
        this.estado = nuevo;
    }
}
//-----------------------------------------------------------------------

const ReparacionCelular = (function (){
    let sucursal;

    function configurar(){
        $("#sucursal").text(sucursal);
    }

    function eventos(){
        $("#btnIniciar").on("click", iniciar);
    }

    async function iniciar(){
        console.log("Boton presionado");

        $("#detalles").hide();

        const {value: tel} = await Swal.fire({
            title: "Datos del Telefono",
            html:  `
            <input id="marca" class="swal2-input" placeholder="Marca">
            <input id="modelo" class="swal2-input" placeholder="Modelo">
            <input id="serie" class="swal2-input" placeholder="Serie">
            <input id="imei" class="swal2-input" placeholder="IMEI">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const serie = document.getElementById('serie').value;
                const imei = document.getElementById('imei').value;

                if(serie === "REPORTADO" || imei ==="REPORTADO"){
                    Swal.showValidationMessage('Telefono REPORTADO. No se puede reparar.');
                    return false;
                }

                return{
                    marca: document.getElementById('marca').value,
                    modelo: document.getElementById('modelo').value,
                    serie: serie,
                    imei: imei
                };

            }
        });

        if(!tel) return;

        const telefono = new Telefono(tel.marca, tel.modelo, tel.serie, tel.imei);

        const{value: diag} = await Swal.fire({
            title: "Diagnostico Inicial",
            input: "textarea",
            inputPlaceholder: "Ej: Pantalla rota, no enciende...",
            showCancelButton: true
        });

        if(!diag) return;

        const {value: cli} = await Swal.fire({
            title: "Datos del Cliente",
            html:`
            <input id="dni" class="swal2-input" placeholder="DNI">
            <input id="nombres" class="swal2-input" placeholder="Nombres">
            <input id="apellidos" class="swal2-input" placeholder="Apellidos">
            `,
            focusConfirm: false,
            preConfirm: ()=>({
                dni: document.getElementById("dni").value,
                nombres: document.getElementById("nombres").value,
                apellidos: document.getElementById("apellidos").value
            })
        });
        if(!cli) return;

        const cliente = new Cliente(cli.dni, cli.nombres, cli.apellidos);

        const {value:auth} = await Swal.fire({
            title: "Autorizacion y Abono",
            html:`
                <div style="text-align:left;">
                    <input type="checkbox" id="autorizo">
                    <label for="autorizo">Autorizo la reparacion</label>
                </div>
                <input id="costo" class="swal2-input" placeholder="Costo total" type="number">
                <input id="abono" class="swal2-input" placeholder="Abono (50%)" type="number">
            `,
            focusConfirm: false,
            preConfirm: ()=>{
                const check = document.getElementById("autorizo").checked
                const costo = parseFloat(document.getElementById("costo").value);
                const abono = parseFloat(document.getElementById("abono").value);

                if(!check){
                    Swal.showValidationMessage("Debe autorizar");
                    return false;
                }

                if(isNaN(costo) || costo<=0){
                    Swal.showValidationMessage(`Abono debe ser al menos ${costo*0.5}`);
                    return false;
                }

                return {abono, costo};
            }
        });

        if(!auth) return;

        const tecnicos =[
            new Tecnico("Ana", ["Samsung", "Xiaomi"]),
            new Tecnico("Luis", ["iPhone", "Huawei"]),
            new Tecnico("Maria", ["Samsung", "iPhone"])
        ];

        const tecnico = tecnicos.find(t => t.tieneSkill(telefono.marca));
        if(!tecnico){
            await Swal.fire("Error", "No hay tecnico para esta marca", "error");
            return;
        }

        const{value:reps} = await Swal.fire({
            title: "Repuestos",
            html:`
                <input id="rep1" class="swal2-input" placeholder="Repuesto 1">
                <input id="rep2" class"swal2-inpur" placeholder="Repuesto 2 (opcional)">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const r1 = document.getElementById('rep1').value;
                const r2 = document.getElementById('rep2').value;
                const lista=[];
                if(r1) lista.push(r1);
                if(r2) lista.push(r2);
                return lista;
            }
        });

        if(!reps) return;

        const reparacion = new Reparacion(telefono, cliente, diag, auth.abono, tecnico);
        reps.forEach(r=> reparacion.agregarRepuesto(r));
        reparacion.cambiarEstado("En reparacion");
        reparacion.cambiarEstado("Listo");

        guardarEnStorage(reparacion);

        mostrarEnPantalla(reparacion);
    }

    function mostrarEnPantalla(r){
        $("#cliente").text(r.cliente.nombres +" "+ r.cliente.apellidos);
        $("#telefono").text(r.telefono.marca +" "+ r.telefono.modelo);
        $("#diagnostico").text(r.diagnostico);
        $("#abono").text(r.abono);
        $("#tecnico").text(r.tecnico.nombre);
        $("#repuestos").text(r.repuestos.join(", "));
        $("#estado").text(r.estado);

        $("#detalles").show();
    }

    function guardarEnStorage(reparacion){
        const texto = JSON.stringify(reparacion);
        localStorage.setItem("reparacion_actual", texto);
    }

    function cargarDeStorage(){
        const texto = localStorage.getItem("reparacion_actual");
        if(!texto) return null;

        const datos = JSON.parse(texto);

        const tel= new Telefono(datos.telefono.marca, datos.telefono.modelo, datos.telefono.serie, datos.telefono.imei);
        const cli= new Cliente(datos.cliente.dni, datos.cliente.nombres, datos.cliente.apellidos);
        const tec= new Tecnico(datos.tecnico.nombre, datos.tecnico.skills);

        const r= new Reparacion(tel, cli, datos.diagnostico, datos.abono, tec);
        r.repuestos= datos.repuestos;
        r.estado= datos.estado;

        return r;
    }

    return {
        init: function(params){
            sucursal= params.sucursal;
            configurar();
            eventos();

            const guardada= cargarDeStorage();
            if(guardada){
                mostrarEnPantalla(guardada);
            }
        }
    }

})();