const db = new DB();
// central01 es el objeto Central principal del sistema

const loadingSystem = () => {
    const branches = db.getData("Sucursales");
    if (!branches.length) return;

    const arrayBranches = branches.map(branch => {
        // Crear una nueva instancia de Sucursal y copiarle los datos guardados
        const newBranch = new Sucursal();
        Object.assign(newBranch, branch);

        // Restaurar las clases hijas si existen
        if (newBranch.clientes) {
            newBranch.clientes = newBranch.clientes.map(c => {
            const cliente = Object.assign(new Cliente(), c);

            // Restaurar celulares del cliente
            if (cliente.celulares) {
                cliente.celulares = cliente.celulares.map(cel =>
                    Object.assign(new Celular(), cel)
                );
            }
            return cliente;
        });}

        if (newBranch.tecnicos) {
            newBranch.tecnicos = newBranch.tecnicos.map(t => Object.assign(new Tecnico(), t));
        }

        if (newBranch.tickets) {
        newBranch.tickets = newBranch.tickets.map(tk => {
            const ticket = Object.assign(new Ticket(), tk);
            ticket.cotizaciones = ticket.cotizaciones.map(c => Object.assign(new Cotizacion(), c));
            return ticket;
        });}

        return newBranch;
    });

    central01.loadingBranches(arrayBranches);
}

const saveBranch = (System) => {
    //console.log("saveBranch", System.sucursales);
    const branchesValues = System.sucursales.map(elemento => elemento.toValue());
    //console.log("branchesValues", branchesValues);
    db.saveData("Sucursales", branchesValues);
}


const loadingSystemUsers = () => {
    const users = db.getData("Usuarios");
    const arrayUsers = users.map(user => {
        const nuevoUser = new UsuarioSistema(user.id, user.clave, user.strTipo);
        return nuevoUser;
    });
    central01.loadingUsers(arrayUsers);
}
const saveUser = (System) => {
    const usersValues = System.usuarios.map(elemento => elemento.toValue());
    db.saveData("Usuarios", usersValues);
}


/*Tal vez
const loadingBranches = (System) => {
    const optionItem = document.querySelector("#sucursal");
    let arrayOptions = [];
    const selectInitial = document.createElement("option");

    selectInitial.value = "no-option";
    selectInitial.textContent = "Seleccione una sucursal";
    arrayOptions.push(selectInitial)

    System.sucursales.forEach(element => {
        const optionItem = document.createElement("option");
        optionItem.value = element.nombre;
        optionItem.textContent = element.nombre;
        arrayOptions.push(optionItem);
    });

    optionItem.replaceChildren(...arrayOptions);
}*/


/*====NO TOCAR====*/

dbReportados = ["IMEI0003", "IMEI0007", "IMEI0008"];


let central01 = new Central("admin", "Reparaciones VibePhone");
//central01.usuarios.push(new UsuarioSistema("admin", "123", "Central"));

/*let arrObjUsuarios = central01.usuarios;*/


let idUsuarioActual = null;

function obtenerFechaActual() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Enero = 0
    const año = String(fecha.getFullYear()).slice(-2); // Solo dos dígitos
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año} ${hora}:${minutos}`;
}

async function mostrarFormulario() {
    loadingSystem();
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">ID de usuario</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Contraseña</div>
            <input type="password" id="swal-input2" class="swal2-input">            
        </div>`,
        confirmButtonText: `Iniciar sesión`,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        }
    });
    if (formValues) {
        /*======== ADMINISTRADOR ========*/
        if (formValues[0] == "admin" && formValues[1] == "123") {            
            idUsuarioActual = "admin";
            document.getElementById("divCentral").style.display = "block";
            document.getElementById("crearSucursal").onclick = crearNuevaSucursal;
            document.getElementById("cerrarSesion").onclick = () => cerrarSesion("divCentral");
            verSucursales();
            return null;
        }
        /*======== MORTALES ========*/
        for (x in central01.usuarios) {

            if (formValues[0] == central01.usuarios[x].id && formValues[1] == central01.usuarios[x].clave) {

                if (central01.usuarios[x].strTipo == "Sucursal") {
                    console.log("Es Sucursal");
                    idUsuarioActual = central01.usuarios[x].id;
                    document.getElementById("divSucursal").style.display = "block";
                    document.getElementById("crearTicket").onclick = crearNuevoTicket;                    
                    document.getElementById("crearTecnico").onclick = crearNuevoTecnico;
                    document.getElementById("crearCliente").onclick = crearNuevoCliente;
                    document.getElementById("cerrarSesionSucursal").onclick = () => cerrarSesion("divSucursal");
                    document.getElementById("verUsuarioActual").innerText = idUsuarioActual;
                    verTecnicos();
                    verClientes();
                    verTickets();
                    return null;
                }

                if (central01.usuarios[x].strTipo == "Cliente") {
                    console.log("Es Cliente");
                    idUsuarioActual = central01.usuarios[x].id;
                    document.getElementById("divCliente").style.display = "block";
                    document.getElementById("crearCelular").onclick = crearCelular;
                    document.getElementById("autorizarAtencion").onclick = autorizarAtencion;
                    document.getElementById("pagarCotizacion").onclick = pagarCotizacion;
                    document.getElementById("cerrarSesionCliente").onclick = () => cerrarSesion("divCliente");
                    document.getElementById("verUsuarioActualCliente").innerText = idUsuarioActual;
                    verCelulares()
                    verTicketsCliente();
                    verCotizacionesCliente();
                }
                if (central01.usuarios[x].strTipo == "Tecnico") {
                    console.log("Es Técnico");
                    idUsuarioActual = central01.usuarios[x].id;
                    document.getElementById("divTecnico").style.display = "block";
                    document.getElementById("crearHabilidad").onclick = crearHabilidad;
                    document.getElementById("crearCotizacion").onclick = crearCotizacion;
                    document.getElementById("atenderTicket").onclick = atenderTicket;
                    document.getElementById("declararEstadoCelular").onclick = declararEstadoCelular;
                    document.getElementById("cerrarTicket").onclick = cerrarTicket;
                    document.getElementById("cerrarSesionTecnico").onclick = () => cerrarSesion("divTecnico");
                    document.getElementById("verUsuarioActualTecnico").innerText = idUsuarioActual;
                    verHabilidades();
                    verTicketsTecnico();
                    verCotizacionesTecnico();
                }
            }
        }
        if (idUsuarioActual == null) { mostrarFormulario(); };
    }
}

async function cerrarSesion(div) {
    document.getElementById(div).style.display = "none";
    idUsuarioActual = null;
    mostrarFormulario();
}

async function verSucursales() {
    let cuerpoTabla = document.getElementById("tablaSucursales");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo

    central01.sucursales.forEach(sucursal => {

        //Lista de ID's de Tecnicos
        let idTecnicos = sucursal.tecnicos.map(tecnico => tecnico.id).join(",");
        let cantTecnicos = sucursal.tecnicos.length;

        //Lista de ID's de Clientes
        let idClientes = sucursal.clientes.map(cliente => cliente.id).join(",");
        let cantClientes = sucursal.clientes.length;

        //Lista de ID's de Tickets
        let idTickets = sucursal.tickets.map(ticket => ticket.id).join(",");
        let cantTickets = sucursal.tickets.length;

        //Lista de ID's de Reportados
        let idReportados = sucursal.reportados.map(reportado => reportado.id).join(",");
        let cantReportados = sucursal.reportados.length;

        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${sucursal.id}</td>
            <td>${sucursal.nombre}</td>
            <td>${cantTecnicos}: <br>${idTecnicos ? `${idTecnicos}` : ""}</td>
            <td>${cantClientes}: <br>${idClientes ? `${idClientes}` : ""}</td>
            <td>${cantTickets}: <br>${idTickets ? `${idTickets}` : ""}</td>
            <td>${cantReportados}: <br>${idReportados ? `${idReportados}` : ""}</td>`;
        cuerpoTabla.appendChild(fila);
    });
}

async function crearNuevaSucursal() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">ID de Sucursal</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Nombre de Sucursal</div>
            <input id="swal-input2" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Contraseña para Sucursal</div>
            <input type="password" id="swal-input3" class="swal2-input">
        </div>`,
        confirmButtonText: `Crear Sucursal`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value,
                document.getElementById("swal-input3").value
            ];
        }
    });
    if (formValues) {
        central01.crearSucursal(formValues[0], formValues[1]);
        central01.crearUsuario(formValues[0], formValues[2], "Sucursal");
        verSucursales();
        //LOCALSTORAGE
        saveBranch(central01);
        saveUser(central01);
    }
}

async function crearNuevoTicket() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">ID de Ticket</div>            
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Nro.Serie de Celular</div>
            <input id="swal-input2" class="swal2-input">
            <br><br>
            
        </div>`,
        confirmButtonText: `Crear Ticket`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            if(idUsuarioActual == sucursal.id){
                let nuevoTicket = sucursal.crearTicket(formValues[0], formValues[1]);                
                if (nuevoTicket == "reportado") { Swal.fire("Celular figura como reportado.");}
                if (nuevoTicket == "Habilidad no encontrada.") { Swal.fire("No hay técnicos con la habilidad necesaria.");}
                if (nuevoTicket == "Celular invalido.") { Swal.fire("No hay celular registrado con ese Nro. de serie.");}
                verTickets();
                verTecnicos();
                verClientes(); 
                //LOCALSTORAGE
                saveBranch(central01);
                
            }
        });        
    }
}

async function verTickets() {
    
    central01.sucursales.forEach(sucursal => {
        if(idUsuarioActual == sucursal.id){            
            let cuerpoTabla = document.getElementById("tablaTickets");
            cuerpoTabla.innerHTML = ""; // limpia el contenido previo            
            sucursal.tickets.forEach(ticket => {
                let fila = document.createElement("tr");
                fila.innerHTML = `
                <td>${ticket.id}</td>
                <td>${ticket.celular.id}</td>
                <td>${ticket.cliente}</td>
                <td>${ticket.tecnico}</td>
                <td>${ticket.inicio}</td>
                <td>${ticket.historial.length}</td>
                <td>${ticket.cotizaciones.length}</td>
                <td>${ticket.autorizacion}</td>
                <td>${ticket.fin}</td>`;
                cuerpoTabla.appendChild(fila);
            });                                   
        }
    });
}

async function crearNuevoTecnico() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">ID de Técnico</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Nombre de Técnico</div>
            <input id="swal-input2" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Contraseña para Técnico</div>
            <input type="password" id="swal-input3" class="swal2-input">
        </div>`,
        confirmButtonText: `Crear Técnico`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value,
                document.getElementById("swal-input3").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            if (idUsuarioActual == sucursal.id) {
                sucursal.crearTecnico(formValues[0], formValues[1]);
            }
        });
        central01.crearUsuario(formValues[0], formValues[2], "Tecnico");
        verTecnicos();
        //LOCALSTORAGE
        saveBranch(central01);
        saveUser(central01);     
    }
}

async function verTecnicos() {
    let cuerpoTabla = document.getElementById("tablaTecnicos");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo

    central01.sucursales.forEach(sucursal => {
        if (idUsuarioActual == sucursal.id) {
            sucursal.tecnicos.forEach(tecnico => {
                //Lista de Nombres's de Habilidades
                let nombreHabilidad = tecnico.habilidades.map(habilidad => habilidad.nombre).join(", ");
                let cantHabilidades = tecnico.habilidades.length;
                //Lista de ID's de Tareas
                let idTicket = tecnico.tareas.map(tarea => tarea.id).join(",");
                let cantTickets = tecnico.tareas.length;

                let fila = document.createElement("tr");
                fila.innerHTML = `
                <td>${tecnico.id}</td>
                <td>${tecnico.nombre}</td>
                <td>${cantHabilidades}: <br>${nombreHabilidad ? `${nombreHabilidad}` : ""}</td>
                <td>${cantTickets}: <br>${idTicket ? `${idTicket}` : ""}</td>
                `;
                cuerpoTabla.appendChild(fila);
            });
        }
    });
}

async function crearNuevoCliente() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">ID de Cliente</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Nombre de Cliente</div>
            <input id="swal-input2" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Contraseña para Cliente</div>
            <input type="password" id="swal-input3" class="swal2-input">
        </div>`,
        confirmButtonText: `Crear Cliente`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value,
                document.getElementById("swal-input3").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            if (idUsuarioActual == sucursal.id) {
                sucursal.crearCliente(formValues[0], formValues[1]);
            }
        });
        central01.crearUsuario(formValues[0], formValues[2], "Cliente");
        verClientes();
        //LOCALSTORAGE
        saveBranch(central01);
        saveUser(central01);
    }
}
async function verClientes() {
    let cuerpoTabla = document.getElementById("tablaClientes");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo

    central01.sucursales.forEach(sucursal => {
        if (idUsuarioActual == sucursal.id) {
            sucursal.clientes.forEach(cliente => {

                //Lista de Id's de Celulares
                let idCelular = cliente.celulares.map(celular => celular.id).join(", ");
                let cantCelulares = cliente.celulares.length;

                let fila = document.createElement("tr");
                fila.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cantCelulares}: <br>${idCelular ? `${idCelular}` : ""}</td>`;
                cuerpoTabla.appendChild(fila);
            });
        }
    });
}

async function crearCelular() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">Nro Serie de Celular</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">IMEI de Celular</div>
            <input id="swal-input2" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Marca de Celular</div>
            <input id="swal-input3" class="swal2-input">
        </div>`,
        confirmButtonText: `Registrar Celular`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value,
                document.getElementById("swal-input3").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            sucursal.clientes.forEach(cliente => {
                if (idUsuarioActual == cliente.id) {
                    cliente.crearCelular(formValues[0], formValues[1], formValues[2])
                }
            });
        });
        verCelulares();

        //LOCALSTORAGE
        saveBranch(central01);
        
    }
}

async function verCelulares() {
    let cuerpoTabla = document.getElementById("tablaCelulares");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo

    central01.sucursales.forEach(sucursal => {
        sucursal.clientes.forEach(cliente => {
            if (idUsuarioActual == cliente.id) {
                cliente.celulares.forEach(celular => {
                    let fila = document.createElement("tr");
                    fila.innerHTML = `
                    <td>${celular.id}</td>
                    <td>${celular.imei}</td>
                    <td>${celular.marca}</td>
                    <td>${celular.estado}</td>
                    <td>${celular.esReportado}</td>`;
                    cuerpoTabla.appendChild(fila);
                });
            }
        });
    });
}

async function verTicketsCliente() {    
    let cuerpoTabla = document.getElementById("tablaTicketClientes");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo    
    central01.sucursales.forEach(sucursal => {
        sucursal.tickets.forEach(ticket => {
            if(idUsuarioActual == ticket.cliente){
                let fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.celular.id}</td>
                    <td>${ticket.cliente}</td>
                    <td>${ticket.tecnico}</td>
                    <td>${ticket.inicio || "—"}</td>
                    <td>
                        ${ticket.historial.length}:<br>
                        ${ticket.historial.map(c => c).join("<br>")}
                    </td>
                    <td>
                        ${ticket.cotizaciones.length}:<br>
                        ${ticket.cotizaciones.map(c => `ID: ${c.id}, ¿Pagado? ${c.estadoPago}`).join("<br>")}                        
                    </td>
                    <td>${ticket.autorizacion ? "Sí" : "No"}</td>
                    <td>${ticket.fin || "—"}</td>`;
                cuerpoTabla.appendChild(fila);
            }
        });
    });
}

async function crearHabilidad() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">Nombre de Habilidad</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Años de Experiencia de Habilidad</div>
            <input id="swal-input2" class="swal2-input">            
        </div>`,
        confirmButtonText: `Registrar Habilidad`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            sucursal.tecnicos.forEach(tecnico => {
                if (idUsuarioActual == tecnico.id) {
                    tecnico.crearHabilidad(formValues[0], formValues[1]);
                }
            });
        });
        verHabilidades();
        //LOCALSTORAGE
        saveBranch(central01);        
    }
}

async function verHabilidades() {
    central01.sucursales.forEach(sucursal => {
        sucursal.tecnicos.forEach(tecnico => {
            if (idUsuarioActual == tecnico.id) {
                let cuerpoTabla = document.getElementById("tablaHabilidades");
                cuerpoTabla.innerHTML = ""; // limpia el contenido previo

                tecnico.habilidades.forEach(habilidad => {
                    let fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${habilidad.nombre}</td>
                        <td>${habilidad.experiencia}</td>`;
                    cuerpoTabla.appendChild(fila);
                });
            }
        });
    });
}

async function verTicketsTecnico() {    

    let cuerpoTabla = document.getElementById("tablaTicketsTecnicos");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo

    central01.sucursales.forEach(sucursal => {        
        sucursal.tickets.forEach(ticket => {
            
                if(idUsuarioActual == ticket.tecnico){
                    console.log("OKOKOK");
                let fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.celular.id}</td>
                    <td>${ticket.cliente}</td>
                    <td>${ticket.tecnico}</td>
                    <td>${ticket.inicio || "—"}</td>
                    <td>
                        ${ticket.historial.length}:<br>
                        ${ticket.historial.map(c => c).join("<br>")}
                    </td>
                    <td>
                        ${ticket.cotizaciones.length}:<br>
                        ${ticket.cotizaciones.map(c => `ID: ${c.id}, ¿Pagado? ${c.estadoPago}`).join("<br>")}                        
                    </td>
                    <td>${ticket.autorizacion ? "Sí" : "No"}</td>
                    <td>${ticket.fin || "—"}</td>`;
                cuerpoTabla.appendChild(fila);
            }
        });
    });
}




async function crearCotizacion() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>

            <div class="subtitulosLogin">ID de Cotización</div>
            <input id="swal-input1" class="swal2-input">

            <br><br>
            <div class="subtitulosLogin">Concepto</div>
            <input id="swal-input2" class="swal2-input">

            <br><br>
            <div class="subtitulosLogin">Monto</div>
            <input id="swal-input3" class="swal2-input">

            <br><br>
            <div class="subtitulosLogin">ID de Ticket</div>
            <input id="swal-input4" class="swal2-input">
        </div>`,
        confirmButtonText: `Crear Cotización`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value,
                document.getElementById("swal-input3").value,
                document.getElementById("swal-input4").value
            ];
        }
    });
    if (formValues) {

        central01.sucursales.forEach(sucursal => {
            sucursal.tickets.forEach(ticket => {
                if (formValues[3] == ticket.id){
                    ticket.crearCotizacion(formValues[0], formValues[1], formValues[2], idUsuarioActual, ticket.cliente, obtenerFechaActual());                    
                }
            });
        });
        verCotizacionesTecnico();
        //LOCALSTORAGE
        saveBranch(central01);
    }
}

async function verCotizacionesTecnico() {

    let cuerpoTabla = document.getElementById("tablaCotizacionesTecnicos");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo

    central01.sucursales.forEach(sucursal => {
        sucursal.tickets.forEach(ticket => {
            ticket.cotizaciones.forEach(cotizacion => {
                console.log(`cotizacion.tecnico: ${cotizacion.tecnico}`);
                if (cotizacion.tecnico == idUsuarioActual){
                    let fila = document.createElement("tr");
                    fila.innerHTML = `
                    <td>${cotizacion.id}</td>
                    <td>${cotizacion.concepto}</td>
                    <td>S/ ${cotizacion.monto}</td>
                    <td>${cotizacion.cliente}</td>
                    <td>${cotizacion.tecnico}</td>
                    <td>${cotizacion.fecha}</td>
                    <td>${cotizacion.estadoPago}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                }
            });
        });
    });
}

async function autorizarAtencion() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">Id de Ticket</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
        </div>`,
        confirmButtonText: `Autorizar Atención`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            sucursal.tickets.forEach(ticket => {
                if(formValues[0] == ticket.id){
                    ticket.autorizarAtencion();
                }
            });
        });
        verTicketsCliente();
        //LOCALSTORAGE
        saveBranch(central01);
    }
}

async function pagarCotizacion() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">Id de Cotización</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
        </div>`,
        confirmButtonText: `Pagar Cotización`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            sucursal.tickets.forEach(ticket => {
                ticket.cotizaciones.forEach(cotizacion => {
                    if(cotizacion.id == formValues[0]){                            
                        cotizacion.pagarCotizacion();
                    }
                });

            });
        });
        verCotizacionesCliente();
        verTicketsCliente();
        //LOCALSTORAGE
        saveBranch(central01);
    }
}

async function verCotizacionesCliente() {
    let cuerpoTabla = document.getElementById("tablaCotizacionesClientes");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo
    central01.sucursales.forEach(sucursal => {
        sucursal.tickets.forEach(ticket => {
            ticket.cotizaciones.forEach(cotizacion => {
                console.log(`cotizacion.cliente: ${cotizacion.cliente}`);
                if (cotizacion.cliente == idUsuarioActual){
                    let fila = document.createElement("tr");
                    fila.innerHTML = `
                    <td>${cotizacion.id}</td>
                    <td>${cotizacion.concepto}</td>
                    <td>S/ ${cotizacion.monto}</td>
                    <td>${cotizacion.cliente}</td>
                    <td>${cotizacion.tecnico}</td>
                    <td>${cotizacion.fecha}</td>
                    <td>${cotizacion.estadoPago}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                }
            });
        });
    });
}

async function verCotizacionesTecnico() {

    let cuerpoTabla = document.getElementById("tablaCotizacionesTecnicos");
    cuerpoTabla.innerHTML = ""; // limpia el contenido previo

    central01.sucursales.forEach(sucursal => {
        sucursal.tickets.forEach(ticket => {
            ticket.cotizaciones.forEach(cotizacion => {
                console.log(`cotizacion.tecnico: ${cotizacion.tecnico}`);
                if (cotizacion.tecnico == idUsuarioActual){
                    let fila = document.createElement("tr");
                    fila.innerHTML = `
                    <td>${cotizacion.id}</td>
                    <td>${cotizacion.concepto}</td>
                    <td>S/ ${cotizacion.monto}</td>
                    <td>${cotizacion.cliente}</td>
                    <td>${cotizacion.tecnico}</td>
                    <td>${cotizacion.fecha}</td>
                    <td>${cotizacion.estadoPago}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                }
            });
        });
    });
}


async function declararEstadoCelular() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">Nro. Serie de Celular</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Estado Actual</div>
            <input id="swal-input2" class="swal2-input">            
        </div>`,
        confirmButtonText: `Actualizar Estado`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            sucursal.clientes.forEach(cliente => {
                cliente.celulares.forEach(celular => {
                    if(formValues[0] == celular.id){
                        celular.actualizarEstado(formValues[1]);
                    }
                });
            });
        });

        //LOCALSTORAGE
        saveBranch(central01);
    }
}

async function cerrarTicket() {
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">ID de Ticket</div>
            <input id="swal-input1" class="swal2-input">            
        </div>`,
        confirmButtonText: `Cerrar Ticket`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            sucursal.tickets.forEach(ticket =>{
                if (formValues[0]==ticket.id){
                    ticket.cerrarTicket(obtenerFechaActual());
                }
            });
        });   
        verTicketsTecnico();
        //LOCALSTORAGE
        saveBranch(central01);     
    }    
}

async function atenderTicket(){
    const { value: formValues } = await Swal.fire({
        html: `
        <div>
        <br><br><br>
            <i id="celularLogin" class="bi bi-phone"></i><i id="martilloLogin" class="bi bi-hammer"></i><br>
            <h3 class="titulosLogin">Reparaciones</h3><h1 class="titulosLogin">Vibe Phone</h1>
            <div class="subtitulosLogin">Id de Ticket</div>
            <input id="swal-input1" class="swal2-input">
            <br><br>
            <div class="subtitulosLogin">Anotación</div>
            <input id="swal-input2" class="swal2-input">
        </div>`,
        confirmButtonText: `Registrar Anotación`,

        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        }
    });
    if (formValues) {
        central01.sucursales.forEach(sucursal => {
            sucursal.tickets.forEach(ticket => {
                if (ticket.id == formValues[0]){
                    ticket.actualizarEstadoTicket(formValues[1]);
                }
            });
        });
        verTicketsTecnico();
        //LOCALSTORAGE
        saveBranch(central01);  
    }
}












/*COSAS DE LOCALSTORAGE*/

//saveBranch(central01);
//loadingBranches(System);

loadingSystem();
loadingSystemUsers();