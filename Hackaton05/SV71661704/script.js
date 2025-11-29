class Persona {
      constructor(nombre, telefono) {
        this.nombre = nombre;
        this.telefono = telefono;
      }
    }

    class Cliente extends Persona {
      constructor(nombre, telefono, autorizacion, abono) {
        super(nombre, telefono);
        this.autorizacion = autorizacion;
        this.abono = abono;
      }
    }

    class Tecnico extends Persona {
      constructor(nombre, telefono, skills) {
        super(nombre, telefono);
        this.skills = skills;
      }
      puedeReparar(marca) {
        return this.skills.includes(marca.toUpperCase());
      }
    }

    class Telefono {
      constructor(marca, modelo, imei, serie) {
        this.marca = marca;
        this.modelo = modelo;
        this.imei = imei;
        this.serie = serie;
        this.reportado = false;
      }
    }

    class Reparacion {
      constructor(cliente, telefono, tecnico, diagnostico, costo) {
        this.cliente = cliente;
        this.telefono = telefono;
        this.tecnico = tecnico;
        this.diagnostico = diagnostico;
        this.costo = costo;
        this.estado = "INGRESADO";
        this.repuestos = [];
      }
      avanzarEstado() {
        const estados = ["INGRESADO","EN_REVISION","EN_REPARACION","REPARADO","ENTREGADO"];
        const idx = estados.indexOf(this.estado);
        if (idx < estados.length - 1) this.estado = estados[idx + 1];
      }
    }

    class Sistema {
      constructor() {
        this.clientes = [];
        this.tecnicos = [];
        this.reparaciones = [];
        this.reportes = { imeis: [], series: [] };
      }

      agregarCliente(c) { this.clientes.push(c); }
      agregarTecnico(t) { this.tecnicos.push(t); }
      registrarReparacion(r) { this.reparaciones.push(r); }

      verificarTelefono(tel) {
        return !(this.reportes.imeis.includes(tel.imei) || this.reportes.series.includes(tel.serie));
      }
    }

    // ======== Sistema en ejecución ========
    const sistema = new Sistema();

    // ======== Formularios ========
    document.getElementById("formCliente").addEventListener("submit", e => {
      e.preventDefault();
      const cliente = new Cliente(
        nombreCliente.value,
        telefonoCliente.value,
        autorizacionCliente.checked,
        Number(abonoCliente.value)
      );
      sistema.agregarCliente(cliente);
      actualizarListas();
      e.target.reset();
    });

    document.getElementById("formTecnico").addEventListener("submit", e => {
      e.preventDefault();
      const tecnico = new Tecnico(
        nombreTecnico.value,
        telefonoTecnico.value,
        skillsTecnico.value.split(",").map(s => s.trim().toUpperCase())
      );
      sistema.agregarTecnico(tecnico);
      actualizarListas();
      e.target.reset();
    });

    document.getElementById("formReparacion").addEventListener("submit", e => {
      e.preventDefault();

      if (sistema.clientes.length === 0) return alert("Debe registrar al menos un cliente");
      const cliente = sistema.clientes[sistema.clientes.length - 1];

      const telefono = new Telefono(marca.value, modelo.value, imei.value, serie.value);
      if (!sistema.verificarTelefono(telefono)) return alert("El teléfono está reportado");

      const tecnico = sistema.tecnicos.find(t => t.puedeReparar(marca.value));
      if (!tecnico) return alert("No hay técnicos con skills para esta marca");

      if (!cliente.autorizacion || cliente.abono < costo.value / 2)
        return alert("Falta autorización o abono del 50%");

      const reparacion = new Reparacion(
        cliente,
        telefono,
        tecnico,
        diagnostico.value,
        Number(costo.value)
      );

      sistema.registrarReparacion(reparacion);
      actualizarListas();
      e.target.reset();
    });

    // ======== Mostrar Datos ========
    function actualizarListas() {
      listaClientes.innerHTML = sistema.clientes.map(c => 
        `<li>${c.nombre} - Autorizado: ${c.autorizacion ? '✅' : '❌'} - Abono: S/${c.abono}</li>`
      ).join('');

      listaTecnicos.innerHTML = sistema.tecnicos.map(t => 
        `<li>${t.nombre} - Skills: ${t.skills.join(', ')}</li>`
      ).join('');

      listaReparaciones.innerHTML = sistema.reparaciones.map((r, i) => 
        `<li class="flex justify-between items-center">
          <span>${r.telefono.marca} ${r.telefono.modelo} - ${r.estado}</span>
          <button onclick="avanzar(${i})" class="bg-blue-500 text-white text-xs px-2 py-1 rounded">Avanzar</button>
        </li>`
      ).join('');
    }

    function avanzar(i) {
      sistema.reparaciones[i].avanzarEstado();
      actualizarListas();
    }