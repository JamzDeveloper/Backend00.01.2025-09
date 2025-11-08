class Telefono {
    estado = null;
    imei = "";
    modelo = "";
    esRobado = 0;
    constructor(imei, marca, modelo, estado = null) {
        this.estado = estado;
        this.imei = imei;
        this.modelo = modelo;
        this.marca = marca;
    }
    actualizarEstado(estado) {
        this.estado = estado
    }
    actualizarEstadoRobado(estado) {
        this.esRobado = estado
    }
}

class Cliente {
    nombre;
    dni
    constructor(nombre, dni) {
        this.nombre = nombre, this.dni = dni
    }
}


const estadoTicket = {
    inicializado: "inicializado",
    proceso: "en proceso",
    finalizado: "finalizado"
}



class Ticket {
    telefono = new Telefono();
    diagnostico;
    porcentaje;
    montoFinal;
    estado;
    cliente;
    autorizacion = 0;
    repuestos = []
    // agregar tecnico responsable

    constructor(telefono, diagnostico, porcentaje, montoFinal, cliente) {
        // validar que vengas los datos
        this.telefono = telefono;
        this.diagnostico = diagnostico;
        this.porcentaje = porcentaje;
        this.montoFinal = montoFinal;
        this.cliente = cliente;
        this.estado = estadoTicket.inicializado;
    }

    autorizar() {
        this.autorizacion = 1;
    }
    agregarRepuesto(repuesto) {
        if (!repuesto) {
            throw new Error("Repuesto invalido")
        }
        this.repuestos.push(repuesto)
    }

    iniciarServicio() {
        if (this.autorizacion && this.porcentaje >= 50) {
            this.telefono.actualizarEstado("en reparacion");
            this.estado = estadoTicket.proceso;
            return "servicio inicializado"
        } else {
            console.log(this.autorizacion)
            return ` No cumple con las condiciones basicas para iniciar el servicio 
            \n${(this.autorizacion == 0) ? "No autorizo" : ""}
            \n${this.porcentaje < 50 ? "No pago el 50%" : ""}

            `

        }
    }

    finalizarServicio() {
        this.telefono.actualizarEstado("reparado");
        this.estado = estadoTicket.finalizado;
        return "Servicio finalizado"
    }

}

class Central {
    _celularesRobados = [];
    sucursales = [];

    agregarCelularRobado(celular) {
        celular.actualizarEstadoRobado(1)
        this._celularesRobados.push(celular);

    }

    //eliminar celular robado --> filter

    agregarSucursal(sucursal) {
        this.sucursales.push(sucursal)

    }
    get celularesRobados() {
        return this._celularesRobados
    }
}

class Sucursal {
    tecnicos = [];
    clientes = [];
    tickets = [];
    contacto = "";
    nombre = "";
    direccion = "";
    central = new Central();
    constructor(nombre, direccion, contacto, central) {

        //Validar que llegue una central y un nombre
        this.nombre = nombre;
        this.direccion = direccion;
        this.contacto = contacto;
        this.central = central
    }
    agregarTicket(ticket) {
        const existCelRobado = this.central.celularesRobados.find(
            (e) => e.imei == ticket.telefono.imei
        );
        if (existCelRobado && existCelRobado.esRobado == 1) {
            console.error("El celular no puede ser reparado porque es robado!!!")
            return
        }

        this.tickets.push(ticket)
        this.clientes.push(ticket.cliente);
        console.log("su equipo fue aceptado")
    }
}


const telefonoRobado1 = new Telefono("123456789", "Sansung", "s23");

const centralIdat = new Central();
centralIdat.agregarCelularRobado(telefonoRobado1);// agregamos celular robado

const tecnoIdatTrujillo = new Sucursal(
    "Tecno-trujillo",
    "trujillo",
    "967567567",
    centralIdat
)
centralIdat.agregarSucursal(tecnoIdatTrujillo)
console.log(tecnoIdatTrujillo)


const iphone = new Telefono("73647392", "Iphone", "16 pro")



const ticketPedro = new Ticket(
    telefonoRobado1,
    "olvido su contraseña",
    80,
    100,
    new Cliente("pedro ramirez", "738484")
);
console.log("Pedro")

tecnoIdatTrujillo.agregarTicket(ticketPedro)

const ticketMaria = new Ticket(
    iphone,
    "olvido su contraseña",
    50,
    100,
    new Cliente("Maria ramirez", "245634")
)
console.log("Maria")
tecnoIdatTrujillo.agregarTicket(ticketMaria);

console.log("autorizando la repacion");
ticketMaria.autorizar()
console.log(ticketMaria.iniciarServicio())

