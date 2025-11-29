



class Central {
    _celularesRobados = [];
    sucursales = [];

    agregarCelularRobado(celular) {
        celular.actualizarEstadoRobado(1);
        this._celularesRobados.push(celular);
    }

    //eliminar celular robado --> filter

    agregarSucursal(sucursal) {
        this.sucursales.push(sucursal);
    }
    get celularesRobados() {
        return this._celularesRobados;
    }
    loadingBranches(branches) {
        this.sucursales = branches;
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

    constructor(direccion2, nombre, direccion, contacto, central) {
        //Validar que llegue una central y un nombre
        this.direccion2 = direccion2;
        this.nombre = nombre;
        this.direccion = direccion;
        this.contacto = contacto;
        this.central = central;
    }
    agregarTicket(ticket) {
        const existCelRobado = this.central.celularesRobados.find(
            (e) => e.imei == ticket.telefono.imei
        );
        if (existCelRobado && existCelRobado.esRobado == 1) {
            console.error("El celular no puede ser reparado porque es robado!!!");
            return;
        }

        this.tickets.push(ticket);
        this.clientes.push(ticket.cliente);
        console.log("su equipo fue aceptado");
    }
    toValue() {
        return {
            tickets: this.tickets,// Tovalue,
            clientes: this.clientes,// TOvalues,
            // employees:this.e,
            contacto: this.contacto,
            direccion: this.direccion,
            nombre: this.nombre,
            central: {}, // toValue
        };
    }
}