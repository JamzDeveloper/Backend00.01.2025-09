dbReportados = ["IMEI0003", "IMEI0007", "IMEI0008"];

class Central {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.sucursales = [];
        this.usuarios = [];
    }
    crearSucursal(id, nombre) {
        let nuevaSucursal = new Sucursal(id, nombre);
        this.sucursales.push(nuevaSucursal);
        return nuevaSucursal;
    }
    loadingBranches(branches){
        this.sucursales = branches;
    }
    crearUsuario(id,clave,strTipo){
        let nuevoUsuario = new UsuarioSistema(id,clave,strTipo);
        this.usuarios.push(nuevoUsuario);
        return nuevoUsuario;
    }
    loadingUsers(users){
        this.usuarios = users;
    }
}

class Sucursal {

    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.tecnicos = [];
        this.clientes = [];
        this.tickets = [];
        this.reportados = [];
    }

    crearTecnico(id, nombre) {
        let tecnicoNuevo = new Tecnico(id, nombre);
        this.tecnicos.push(tecnicoNuevo);
        return tecnicoNuevo;
    }

    crearCliente(id, nombre) {
        let clienteNuevo = new Cliente(id, nombre);
        this.clientes.push(clienteNuevo);
        return clienteNuevo;
    }

    registrarCelularRobado(celular) {
        this.reportados.push(celular);
    }

    crearTicket(idTicket, idCelular) {        
        let clienteEncontrado = this.clientes.find(cli =>
            cli.celulares.some(cel => cel.id === idCelular) // o cel.id === idCelular si usas otro campo
        );
        if (!clienteEncontrado) {            
            return "Celular invalido.";}

        // Buscar el objeto celular dentro de ese cliente
        let celular = clienteEncontrado.celulares.find(cel => cel.id === idCelular);        
        
        if (dbReportados.includes(celular.imei)) {            
            if(!celular.esReportado){
                celular.esReportado = true;
                this.registrarCelularRobado(celular);
                console.log("Celular Reportado como robado.");
            }
            return "reportado";

        } else {
            celular.esReportado = false;
            let tecnicosAptos = [];
            this.tecnicos.forEach((tecnico) => {
                tecnico.habilidades.forEach((habilidad) => {                    
                    if(habilidad.nombre == celular.marca){                        
                        tecnicosAptos.push(tecnico);
                    }
                });
            });

            if (tecnicosAptos.length === 0) {                
                return "Habilidad no encontrada.";
            } else {
                let menosTareas = tecnicosAptos[0].tareas.length;
                let tecnicoSeleccionado = tecnicosAptos[0];
                
        
                for (let x in tecnicosAptos) {
                    if (tecnicosAptos[x].tareas.length < menosTareas) {
                        menosTareas = tecnicosAptos[x].tareas;
                        tecnicoSeleccionado = tecnicosAptos[x];
                    }
                }                

                let ticketFinal = new Ticket(idTicket, celular, clienteEncontrado.id, tecnicoSeleccionado.id);
                this.tickets.push(ticketFinal);
                tecnicoSeleccionado.tareas.push(ticketFinal);
                return ticketFinal;
            }
        }
    }
    toValue(){
        return{
            id: this.id,
            nombre: this.nombre,
            tecnicos: this.tecnicos,
            clientes: this.clientes,
            tickets: this.tickets,
            reportados: this.reportados
        }
    }
}

class Tecnico {

    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.habilidades = [];
        this.tareas = [];
    }

    crearHabilidad(nombre, experiencia) {
        let nuevaHabilidad = new Habilidad(nombre, experiencia);
        this.habilidades.push(nuevaHabilidad);
        return nuevaHabilidad;
    }


}

class Habilidad {
    constructor(nombre, experiencia) {
        this.nombre = nombre;
        this.experiencia = experiencia;
    }

}

class Cliente {

    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.celulares = [];
    }

    crearCelular(id, imei, marca) {
        let celularNuevo = new Celular(id, imei, marca);
        this.celulares.push(celularNuevo);
        return celularNuevo;
    }

}

class Celular {

    constructor(id, imei, marca) {
        this.id = id;
        this.imei = imei;
        this.marca = marca;
        this.esReportado = false;
        this.estado = null;
    }
    actualizarEstado(estado) {
        this.estado = estado;
    }

}

class Ticket {
    constructor(id, celular, cliente, tecnico) {
        this.id = id;
        this.celular = celular;
        this.cliente = cliente;
        this.tecnico = tecnico;
        this.inicio = obtenerFechaActual();
        this.historial = [];
        this.cotizaciones = [];
        this.autorizacion = false;
        this.fin = null;
    }

    autorizarAtencion() {
        this.autorizacion = true;
    }

    crearCotizacion(id, concepto, monto, tecnico, cliente,fecha) {
        let cotizacionNueva = new Cotizacion(id, concepto, monto, cliente, tecnico, fecha);
        this.cotizaciones.push(cotizacionNueva);
        return cotizacionNueva;
    }    

    cerrarTicket(fin) {
        this.fin = fin;
        this.actualizarEstadoTicket("Servicio finalizado por ", this.tecnico);
        this.tecnico.tareas = this.tecnico.tareas.filter(tarea => tarea !== this.id);
    }
    actualizarEstadoTicket(comentario) {
        this.historial.push(comentario);
    }
    
}

class Cotizacion {
    constructor(id, concepto, monto, cliente, tecnico, fecha) {
        this.id = id;
        this.concepto = concepto;
        this.monto = monto;
        this.cliente = cliente;
        this.tecnico = tecnico;
        this.fecha = fecha;
        this.estadoPago = false;
    }
    pagarCotizacion() {
        this.estadoPago = true;
    }
}

class UsuarioSistema {
    constructor(id, clave,strTipo) {
        this.id = id;
        this.clave = clave;
        this.strTipo = strTipo;
    }
    toValue(){
        return{
            id: this.id,
            clave: this.clave,
            strTipo: this.strTipo
        }
    }
}