// fucniones utilidades
function formatearSoles(v){
    var n = Number(v);
    if (!isFinite(n))
        n = 0;
    return "S/ " + n.toFixed(2);
}

function normalizarTexto(s){
    var txt = String(s||"").toLowerCase().trim();
    var out="", prev=false;
    for (var i=0;i<txt.length;i++){
        var ch=txt[i];
        if(ch===" "){
            if(!prev)
                out+=ch;
            prev=true;
        }
        else{
            out+=ch;
            prev=false;
        }
    }
    return out;
}

function dniValido(d){
    var s = String(d||"").trim();
    if (s.length !== 8)
        return false;
    for (var i=0;i<8;i++){
        var c=s.charCodeAt(i);
        if(c<48||c>57)
            return false;
    }
    return true;
}

// classes principales
class Cliente{
    constructor(dni, nombres, apellidos){
        this.dni = dni;
        this.nombres = nombres;
        this.apellidos = apellidos;
    }
    get nombreCompleto(){
        return `${this.nombres} ${this.apellidos}`.trim();
    }
}

class Tecnico{
    constructor({idEmpleado, nombres, apellidos, sucursal, skills=[]}){
        this.idEmpleado = idEmpleado;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.sucursal = sucursal;
        this.skills = skills;
    }
    get nombreCompleto(){
        return `${this.nombres} ${this.apellidos}`.trim();
    }
}

class RegistroReportes {
    static cargar({seriales = [], imeis = []} = {}){
        this.seriales = this.seriales || [];
        this.imeis = this.imeis || [];
        for (let s of seriales){
            s = String(s);
            if (this.seriales.indexOf(s) === -1) this.seriales.push(s);
        }
        for (let i of imeis){
            i = String(i);
            if (this.imeis.indexOf(i) === -1) this.imeis.push(i);
        }
    }

    static estaReportadoSerie(serie){
        const s = String(serie);
        const arr = this.seriales || [];
        return arr.indexOf(s) !== -1;
    }

    static estaReportadoIMEI(imei){
        const i = String(imei);
        const arr = this.imeis || [];
        return arr.indexOf(i) !== -1;
    }

    static estaReportado(serie, imei){
        return this.estaReportadoSerie(serie) || this.estaReportadoIMEI(imei);
    }

    static agregarSerie(serie){
        const s = String(serie);
        this.seriales = this.seriales || [];
        if (this.seriales.indexOf(s) === -1) this.seriales.push(s);
    }

    static agregarIMEI(imei){
        const i = String(imei);
        this.imeis = this.imeis || [];
        if (this.imeis.indexOf(i) === -1) this.imeis.push(i);
    }

    static verificarPoliciaRandomSerie(serie, prob = 0.15){
        const robado = Math.random() < prob;
        if (robado) this.agregarSerie(serie);
        return robado;
    }

    static verificarPoliciaRandomIMEI(imei, prob = 0.15){
        const robado = Math.random() < prob;
        if (robado) this.agregarIMEI(imei);
        return robado;
    }
}
RegistroReportes.seriales = [];
RegistroReportes.imeis = [];

class Telefono {
    constructor({serie, imei, marca, modelo, so}){
        this.serie = serie;
        this.imei = imei;
        this.marca = marca;
        this.modelo = modelo;
        this.so = so;
    }

    validarNoReportado(){
        if (RegistroReportes.estaReportadoSerie(this.serie)){
            throw new Error("Telefono robado: ya está reportado a la policía.");
        }
        if (RegistroReportes.estaReportadoIMEI(this.imei)){
            throw new Error("IMEI robado: ya está reportado a la policía.");
        }
        if (RegistroReportes.verificarPoliciaRandomSerie(this.serie)){
            throw new Error("Telefono robado: ya está reportado a la policía.");
        }
        if (RegistroReportes.verificarPoliciaRandomIMEI(this.imei)){
            throw new Error("IMEI robado: ya está reportado a la policía.");
        }
    }
}

class Repuesto{
    constructor(nombre, costo){
        this.nombre=nombre;
        this.costo=Number(costo)||0;
    }
}

class Sucursal{
    constructor(nombre){
        this.nombre = nombre;
        this.reparaciones = [];
        this.tecnicos = [];
    }
    agregarTecnico(tecnico){
        this.tecnicos.push(tecnico);
    }
    agregarReparacion(reparacion){
        this.reparaciones.push(reparacion);
    }
}

class Reparacion{
    constructor({cliente, telefono, sucursal}){
        this.id = String(Reparacion.seq++);
        this.cliente = cliente;
        this.telefono = telefono;
        this.sucursal = sucursal;
        this.tecnico = null;
        this.estado = "Recepción";
        this.historial = [{estado:this.estado, ts:new Date()}];
        this.diag = null;
        this.autorizado=false;
        this.deposito=0;
        this.repuestos=[];
    }
    estadoActual(estado){
        this.estado = estado;
        const ts = new Date();
        this.historial.push({estado, ts});
        emitir('rep:estado', {id: this.id, estado, ts});
    }
    registrarDiagnostico({descripcion, manoObra, estPartes}){
        if(!descripcion) throw new Error("Debes registrar una descripción del diagnóstico.");
        this.diag = {descripcion, manoObra:Number(manoObra)||0, estPartes:Number(estPartes)||0};
        this.estadoActual("Autorizar");
    }
    autorizar({tieneCarta, deposito}){
        if(!this.diag) throw new Error("Primero registra el diagnóstico.");
        if(!tieneCarta) throw new Error("Se requiere autorización escrita del cliente.");
        const requerido = 0.5 * (this.diag.manoObra + this.diag.estPartes);
        if(Number(deposito||0) < requerido) throw new Error(`El depósito mínimo es 50% (${formatearSoles(requerido)}) del estimado.`);
        this.deposito = Number(deposito)||0;
        this.autorizado = true;
        this.estadoActual("En reparación");
    }
    asignarTecnico(tecnico){
        this.tecnico = tecnico;
        // Parche para que avance una estación cuando asigne un tecnico
        if (this.estado === "Recepción" && !this.diag){
            this.estadoActual("Diagnóstico");
        }
        if (this.estado === "Autorizar" && this.autorizado) {
            try {
                this.avanzar();
            } 
            catch(err){Swal.fire("No se puede ingresar", err.message, "error");}
        }
    }
    agregarRepuesto(repuesto){
        if(!this.diag) throw new Error("Primero registra el diagnóstico.");
        if(!(repuesto instanceof Repuesto)){
            throw new Error("Repuesto inválido.");
        }
        this.repuestos.push(repuesto);
    }
    get totalEstimado(){
        const diagostico = this.diag ? (this.diag.manoObra + this.diag.estPartes) : 0;
        const repuesto = this.repuestos.reduce((a,b)=>a+b.costo,0);
        return diagostico + repuesto;
    }
    avanzar(){
        const i = Reparacion.estaciones.indexOf(this.estado);
        if(i < 0 || i === Reparacion.estaciones.length-1) return;
        const siguiente = Reparacion.estaciones[i+1];
        if(siguiente === "Autorizar" && !this.diag) throw new Error("Registra diagnóstico antes de autorizar.");
        if(siguiente === "En reparación"){
            if(!this.autorizado) throw new Error("Se requiere autorización y depósito 50% para iniciar reparación.");
            if(!this.tecnico) throw new Error("Asigna un técnico apto para la marca.");
        }
        if (siguiente === "Entregado"){
            if (this.saldoPendiente > 0){
                throw new Error(`Debes registrar el pago completo (falta: ${formatearSoles(this.saldoPendiente)}). Usa el botón «Pagado».`);
            }
        }
        this.estadoActual(siguiente);
    }
    get saldoPendiente(){
        const saldo = this.totalEstimado - this.deposito;
        return saldo > 0 ? saldo : 0;
    }
    pagarSaldoPendiente(){
        this.deposito = this.totalEstimado;
    }
}
Reparacion.estaciones = ["Recepción", "Diagnóstico", "Autorizar", "En reparación", "Calidad", "Listo", "Entregado"];
Reparacion.seq = 1;

// Seccion de almacenamiento SessionStorage y LocalStoragr
const LS_KEYS = {
    REPARACIONES: (dni) => `ls_usuario:${dni}_reparaciones`,
};

const SS_KEYS = {
    SESSION: 'ls_session'
};

// Funciones para agregar obtener y quitar data del local y session storage.
function lsSet(k, v){
    localStorage.setItem(k, JSON.stringify(v));
}

function lsGet(k, def = null){
    const s = localStorage.getItem(k);
    return s ? JSON.parse(s) : def;
}

function lsRemove(k){
    localStorage.removeItem(k);
}

function ssSet(k, v){
    sessionStorage.setItem(k, JSON.stringify(v));
}

function ssGet(k, def = null){
    const s = sessionStorage.getItem(k);
    return s ? JSON.parse(s) : def;
}

function ssRemove(k){
    sessionStorage.removeItem(k);
}

// Funciones para convertir a texto plano y leer desde texto plano
function repToPlain(r){
    return {
        id: r.id,
        sucursal: r.sucursal,
        cliente: {dni: r.cliente.dni, nombres: r.cliente.nombres, apellidos: r.cliente.apellidos},
        telefono: {serie: r.telefono.serie, imei: r.telefono.imei, marca: r.telefono.marca, modelo: r.telefono.modelo, so: r.telefono.so},
        tecnico: r.tecnico ? {idEmpleado: r.tecnico.idEmpleado, nombres: r.tecnico.nombres, apellidos: r.tecnico.apellidos, sucursal: r.tecnico.sucursal, skills: r.tecnico.skills} : null,
        estado: r.estado,
        historial: (r.historial || []).map(h => ({estado: h.estado, ts: (h.ts instanceof Date ? h.ts.toISOString() : h.ts)})),
        diag: r.diag,
        autorizado: r.autorizado,
        deposito: r.deposito,
        repuestos: (r.repuestos || []).map(p => ({nombre: p.nombre, costo: p.costo}))
    };
}

function repFromPlain(o){
    const cli = new Cliente(o.cliente.dni, o.cliente.nombres, o.cliente.apellidos);
    const tel = new Telefono(o.telefono);
    const r = new Reparacion({cliente: cli, telefono: tel, sucursal: o.sucursal});
    r.id = o.id;
    r.tecnico = o.tecnico ? new Tecnico(o.tecnico) : null;
    r.estado = o.estado;
    r.historial = (o.historial || []).map(h => ({estado: h.estado, ts: new Date(h.ts)}));
    r.diag = o.diag;
    r.autorizado = !!o.autorizado;
    r.deposito = Number(o.deposito)||0;
    r.repuestos = (o.repuestos || []).map(p => new Repuesto(p.nombre, Number(p.costo)||0));
    return r;
}

function recomputarSecuencia(arr){
    const maxId = arr.reduce((m, r) => Math.max(m, parseInt(r.id,10)||0), 0);
    Reparacion.seq = (maxId||0) + 1;
}

// Funciones eventos
function on(tipo, fn){
    document.addEventListener(tipo, fn);
}

function off(tipo, fn){
    document.removeEventListener(tipo, fn);
}

function emitir(tipo, detail){
    document.dispatchEvent(new CustomEvent(tipo, {detail}));
}

// modulo principal
const Taller = (function(){
    let sucursales = [];
    let reparaciones = [];
    let usuarioActual = null;

    const $session = () => document.getElementById("sessionStatus");
    const $btnLogin = () => document.getElementById("btnLogin");
    const $btnLogout = () => document.getElementById("btnLogout");
    const $tbl = () => document.getElementById("tblReparaciones");
    const $tbody = () => $tbl().querySelector("tbody");

    const rehacerTabla = () => {
        const body = $tbody();
        body.innerHTML = "";

        reparaciones.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.sucursal}</td>
            <td>${r.cliente ? r.cliente.nombreCompleto : "-"}</td>
            <td>${r.telefono ? r.telefono.marca : "-"} ${r.telefono ? (r.telefono.modelo || "") : ""}</td>
            <td><div class="small">S:${r.telefono ? (r.telefono.serie || "-") : "-"}<br/>I:${r.telefono ? (r.telefono.imei || "-") : "-"}</div></td>
            <td>${r.tecnico ? r.tecnico.nombreCompleto : "-"}</td>
            <td><span class="badge badge-info badge-state">${r.estado}</span></td>
            <td>${formatearSoles(r.deposito)}</td>
            <td>${formatearSoles(r.totalEstimado)}</td>`;
            body.appendChild(tr);
        });
    };

    function userKey(){
        return usuarioActual ? LS_KEYS.REPARACIONES(usuarioActual.dni) : null;
    }
    
    function persistirReparaciones(){
        const K = userKey();
        if (!K) return;
        lsSet(K, reparaciones.map(repToPlain));
    }

    function cargarReparaciones(){
        const K = userKey();
        if (!K){
            reparaciones = [];
            rehacerTabla();
            return;
        }
        const data = lsGet(K, []);
        reparaciones = data.map(repFromPlain);
        recomputarSecuencia(reparaciones);
        rehacerTabla();
    }

    const idAcciones = ["btnIngresar", "btnDiagnostico", "btnAutorizar", "btnAsignarTecnico", "btnRepuesto", "btnAvanzar", "btnPagado", "btnVerHistorial"];

    function toggleAcciones(disabled){
        idAcciones.forEach(id=>{
            const el = document.getElementById(id);
            if(!el) return;
            el.disabled = !!disabled;
            el.classList.toggle("disabled", !!disabled);
        });
    }

    function updateSessionUI(){
        if(usuarioActual){
            $session().classList.remove("badge-secondary");
            $session().classList.add("badge-success");
            $session().textContent = `Sesión: ${usuarioActual.nombreCompleto}`;
            $btnLogin().classList.add("d-none");
            $btnLogout().classList.remove("d-none");
        }
        else{
            $session().classList.remove("badge-success");
            $session().classList.add("badge-secondary");
            $session().textContent = "No autenticado";
            $btnLogin().classList.remove("d-none");
            $btnLogout().classList.add("d-none");
        }
    }

    async function login(){
        const {value: form} = await Swal.fire({
            title: "Iniciar sesión",
            html: `
            <div class="form-group text-left"><label><b>DNI</b></label>
            <input id="dniL" class="form-control" placeholder="DNI" maxlength="8" inputmode="numeric" pattern="\\d{8}">
            </div>
            <div class="form-group text-left"><label><b>Nombres</b></label>
            <input id="nomL" class="form-control" placeholder="Nombres">
            </div>
            <div class="form-group text-left"><label><b>Apellidos</b></label>
            <input id="apeL" class="form-control" placeholder="Apellidos">
            </div>`,
            showCancelButton: true,
            confirmButtonText: "Entrar",
            preConfirm: () => {
                const p = Swal.getPopup();
                const dni = p.querySelector('#dniL').value.trim();
                const nom = p.querySelector('#nomL').value.trim();
                const ape = p.querySelector('#apeL').value.trim();
            
            if (!dniValido(dni)) {
                Swal.showValidationMessage("El DNI debe tener exactamente 8 números.");
                return false;
            }
            return {dni, nom, ape};
        }
        });
        if(!form) return;
        usuarioActual = {
            dni: form.dni,
            nombres: form.nom,
            apellidos: form.ape,
            get nombreCompleto(){
                return `${this.nombres} ${this.apellidos}`.trim();
            }
        };
        ssSet(SS_KEYS.SESSION, {dni: usuarioActual.dni, nombres: usuarioActual.nombres, apellidos: usuarioActual.apellidos});
        updateSessionUI();
        toggleAcciones(false);
        cargarReparaciones();
        emitir('session:login', {dni: usuarioActual.dni});
        await Swal.fire("Bienvenido", `Hola, ${usuarioActual.nombreCompleto}`, "success");
    }

    async function logout(){
        usuarioActual = null;
        ssRemove(SS_KEYS.SESSION);
        reparaciones = [];
        rehacerTabla();
        updateSessionUI();
        toggleAcciones(true);
        emitir('session:logout', {});
        await Swal.fire("Sesión cerrada","","success");
    }

    function matchTecnico(tecnico, telefono){
        const skills = (tecnico.skills || []).map(normalizarTexto);
        const brand = normalizarTexto(telefono.marca);
        const model = normalizarTexto(telefono.modelo);
        const os = normalizarTexto(telefono.so);
        const coincideCon = (x) => x && skills.some(s => s === x || s.includes(x) || x.includes(s));
        const matches = {brand: coincideCon(brand), model: coincideCon(model), os: coincideCon(os)};
        const preferido = matches.brand || matches.model || matches.os;
        return {t: tecnico, preferido, matches};
    }

    const getSucursal = (nombre) => sucursales.find(s => normalizarTexto(s.nombre) === normalizarTexto(nombre));

    function rankingTecnicosParaReparacion(rep){
        const suc = getSucursal(rep.sucursal);
        const pool = suc ? suc.tecnicos.slice() : [];
        const data = pool.map(t => matchTecnico(t, rep.telefono));
        data.sort((a,b) => {
            if (b.preferido !== a.preferido) return (b.preferido ? 1 : 0) - (a.preferido ? 1 : 0);
            return a.t.nombreCompleto.localeCompare(b.t.nombreCompleto);
        });
        return data;
    }

    const seleccionarReparacionPorId = async () => {
        if(reparaciones.length===0){
            await Swal.fire("Sin datos","No hay reparaciones","info");
            return null;
        }
        const inputOptions = {};
        reparaciones.forEach(r=>{
            inputOptions[r.id] = `#${r.id} | ${r.telefono.marca} ${r.telefono.modelo} | ${r.cliente.nombreCompleto} (${r.estado})`;
        });
        const {value:id} = await Swal.fire({
            title:"Selecciona la reparación",
            input:"select",
            inputOptions,
            inputPlaceholder:"Selecciona una opción...",
            showCancelButton:true,
            confirmButtonText:"OK",
            cancelButtonText:"Cancelar"
        });
        if(!id) return null;
        return reparaciones.find(r=>r.id===id);
    };

    function requireTecnico(rep){
        if(!rep || !rep.tecnico){
            Swal.fire("Primero debes asignar un técnico","Usa el botón «Asignar técnico».","warning");
            return false;
        }
        return true;
    }

    async function ingresarEquipo(){
        const sucNames = sucursales.map(s=>s.nombre);
        const {value: form} = await Swal.fire({
            title:"Ingreso de equipo",
            html: `
                <div class="form-group text-left"><label><b>Sucursal</b></label>
                <select id="suc" class="form-control">
                    ${sucNames.map(n=>`<option value="${n}">${n}</option>`).join("")}
                </select>
                </div>

                <div class="form-group text-left"><label><b>DNI Cliente</b></label>
                <input id="dni" type="text" class="form-control" placeholder="DNI" maxlength="8" inputmode="numeric" pattern="\\d{8}">
                </div>
                <div class="form-group text-left"><label><b>Nombres</b></label>
                <input id="nom" type="text" class="form-control" placeholder="Nombres">
                </div>
                <div class="form-group text-left"><label><b>Apellidos</b></label>
                <input id="ape" type="text" class="form-control" placeholder="Apellidos">
                </div>
                <hr/>
                <div class="form-group text-left"><label><b>Marca</b></label>
                <input id="marca" type="text" class="form-control" placeholder="Apple / Samsung / ...">
                </div>
                <div class="form-group text-left"><label><b>Modelo</b></label>
                <input id="modelo" type="text" class="form-control" placeholder="iPhone 12 / Galaxy S22 / ...">
                </div>
                <div class="form-group text-left"><label><b>Serie</b></label>
                <input id="serie" type="text" class="form-control" placeholder="Serie">
                </div>
                <div class="form-group text-left"><label><b>IMEI</b></label>
                <input id="imei" type="text" class="form-control" placeholder="IMEI">
                </div>
                <div class="form-group text-left"><label><b>Sistema Operativo</b></label>
                <select id="so" class="form-control">
                    <option value="" disabled selected>Selecciona...</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="Windows Phone">Windows Phone</option>
                </select>
                </div>`,
            focusConfirm:false,
            showCancelButton:true,
            confirmButtonText:"Ingresar",
            preConfirm: () => {
                const p = Swal.getPopup();
                const suc = p.querySelector('#suc').value;
                const dni = p.querySelector('#dni').value.trim();
                const nom = p.querySelector('#nom').value.trim();
                const ape = p.querySelector('#ape').value.trim();
                const marca = p.querySelector('#marca').value.trim();
                const modelo = p.querySelector('#modelo').value.trim();
                const serie = p.querySelector('#serie').value.trim();
                const imei = p.querySelector('#imei').value.trim();
                const so = p.querySelector('#so').value;

                if (!dniValido(dni)) {
                    Swal.showValidationMessage("El DNI debe tener exactamente 8 números.");
                    return false;
                }
                if (!so) {
                    Swal.showValidationMessage("Selecciona el Sistema Operativo.");
                    return false;
                }
                return {suc, dni, nom, ape, marca, modelo, serie, imei, so};
            }
        });
        if(!form) return;

        try{
            const cliente = new Cliente(form.dni, form.nom, form.ape);
            const equipo = new Telefono({serie: form.serie, imei: form.imei, marca: form.marca, modelo: form.modelo, so: form.so});
            equipo.validarNoReportado();
            const rep = new Reparacion({cliente, telefono:equipo, sucursal:form.suc});
            reparaciones.push(rep);
            emitir('rep:creada', {id: rep.id});
            persistirReparaciones();
            emitir('rep:listaActualizada', {cantidad: reparaciones.length});
            const suc = getSucursal(form.suc); if(suc) suc.agregarReparacion(rep);
            await Swal.fire("OK","Equipo ingresado en Recepción","success");
            rehacerTabla();
        }
        catch(err){await Swal.fire("No se puede ingresar", err.message, "error");}
    }

    async function asignarTecnicoManual(){
        const rep = await seleccionarReparacionPorId();
        if(!rep) return;
        const ranked = rankingTecnicosParaReparacion(rep);
        if (ranked.length===0){
            await Swal.fire("Sin técnicos", `No hay técnicos registrados en ${rep.sucursal}.`, "info");
            return;
        }
        const filas = ranked.map((r, idx) => {
        const skills = (r.t.skills||[]).join(", ");
        const chips = [
            r.matches.brand ? `<span class="badge badge-primary">Marca</span>` : "",
            r.matches.model ? `<span class="badge badge-info">Modelo</span>` : "",
            r.matches.os ? `<span class="badge badge-success">SO</span>` : "",
        ].join(" ");

        const prefer = r.preferido ? `<span class="badge badge-dark ml-2">Preferido</span>` : "";

        return `
            <tr class="${r.preferido ? 'table-success' : ''}">
            <td class="text-center align-middle">
                <input type="radio" name="escogerTecnico" value="${r.t.idEmpleado}" ${idx===0 ? "checked" : ""}/>
            </td>
            <td class="align-middle">${(idx+1)}</td>
            <td class="align-middle">
                <b>${r.t.nombreCompleto}</b><br>
                <small class="text-muted">${r.t.sucursal}</small>
                ${prefer}
            </td>
            <td class="align-middle">${skills}</td>
            <td class="align-middle">${chips || '<span class="text-muted small">—</span>'}</td>
            </tr>`;
        }).join("");

        const html = `
        <div class="text-left">
            <p class="small mb-2">Equipo: <b>${rep.telefono.marca} ${rep.telefono.modelo}</b> — SO: <b>${rep.telefono.so||"-"}</b><br>Sucursal: <b>${rep.sucursal}</b></p>
            <div class="table-responsive">
            <table class="table table-sm table-bordered">
                <thead class="thead-light">
                <tr><th></th><th>#</th><th>Técnico</th><th>Skills</th><th>Match</th></tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
            </div>
        </div>`;

        const {isConfirmed} = await Swal.fire({
            title: `Asignar técnico #${rep.id}`,
            html,
            width: 800,
            showCancelButton: true,
            confirmButtonText: "Asignar",
            cancelButtonText: "Cancelar",
            focusConfirm: false, preConfirm: () => {
                const sel = document.querySelector('input[name="escogerTecnico"]:checked');
                if(!sel){
                    Swal.showValidationMessage("Selecciona un técnico.");
                    return false;
                }
                return sel.value;
            }
        });
        if(!isConfirmed) return;

        const sel = document.querySelector('input[name="escogerTecnico"]:checked'); if (!sel) return;
        const id = sel.value;
        const suc = getSucursal(rep.sucursal);
        const tec = (suc && suc.tecnicos) ? suc.tecnicos.find(t => t.idEmpleado === id) : undefined;
        if(!tec){
            await Swal.fire("Error","No se encontró el técnico seleccionado.","error");
            return;
        }

        rep.asignarTecnico(tec);
        emitir('rep:tecnicoAsignado', {id: rep.id, tecnico: tec.idEmpleado});
        persistirReparaciones();
        emitir('rep:listaActualizada', { cantidad: reparaciones.length });
        await Swal.fire("OK", `Asignado a: ${tec.nombreCompleto}`, "success");
        rehacerTabla();
    }

    async function registrarDiagnostico(){
        const rep = await seleccionarReparacionPorId();
        if(!rep) return;
        if(!requireTecnico(rep)) return;
        const { value: form } = await Swal.fire({
            title:`Diagnóstico #${rep.id}`,
            html: `
                <div class="form-group text-left"><label><b>Descripción</b></label><textarea id="desc" class="form-control" rows="3" placeholder="Ej: Pantalla rota, sin encender, etc."></textarea></div>
                <div class="form-group text-left"><label><b>Mano de obra</b></label><input id="mo" type="number" class="form-control" placeholder="0.00"></div>
                <div class="form-group text-left"><label><b>Estimado en partes</b></label><input id="ep" type="number" class="form-control" placeholder="0.00"></div>`,
            showCancelButton:true,
            confirmButtonText:"Guardar",
            preConfirm:()=>({
                desc: desc.value,
                mo: mo.value,
                ep: ep.value
            })
        });
        if(!form) return;

        try{
            rep.registrarDiagnostico({descripcion:form.desc, manoObra:form.mo, estPartes:form.ep});
            emitir('rep:diagnostico', {id: rep.id});
            persistirReparaciones();
            emitir('rep:listaActualizada', {cantidad: reparaciones.length});
            await Swal.fire("OK","Diagnóstico registrado","success");
            rehacerTabla();
        }
        catch(err){await Swal.fire("Error", err.message, "error");}
    }

    async function autorizarYAbonar(){
        const rep = await seleccionarReparacionPorId();
        if(!rep) return;
        if(!requireTecnico(rep)) return;
        const requerido = rep.diag ? 0.5*(rep.diag.manoObra+rep.diag.estPartes) : 0;

        const {value: form} = await Swal.fire({
            title:`Autorizar #${rep.id}`,
            html: `
                <p class="small mb-2">Depósito mínimo: <b>${formatearSoles(requerido)}</b></p>
                <div class="form-group text-left"><label><b>¿Adjunta autorización escrita?</b></label>
                <select id="auth" class="form-control"><option value="si">Sí</option><option value="no">No</option></select></div>
                <div class="form-group text-left"><label><b>Monto depósito</b></label><input id="dep" type="number" class="form-control" placeholder="${requerido.toFixed(2)}"></div>`,
            showCancelButton:true,
            confirmButtonText:"Autorizar",
            preConfirm:()=>({
                auth: auth.value === "si",
                dep: dep.value
            })
        });
        if(!form) return;

        try{
            rep.autorizar({tieneCarta:form.auth, deposito:form.dep});
            emitir('rep:autorizada', {id: rep.id, deposito: rep.deposito});
            persistirReparaciones();
            emitir('rep:listaActualizada', {cantidad: reparaciones.length});
            await Swal.fire("OK","Autorizado y depósito registrado","success");
            rehacerTabla();
        }
        catch(err){await Swal.fire("Error", err.message, "error");}
    }

    async function agregarRepuesto(){
        const rep = await seleccionarReparacionPorId();
        if(!rep) return;
        if(!requireTecnico(rep)) return;
        const {value: form} = await Swal.fire({
            title:`Agregar repuesto #${rep.id}`,
            html: `
                <div class="form-group text-left"><label><b>Nombre del repuesto</b></label><input id="nom" type="text" class="form-control" placeholder="Pantalla, batería, etc."></div>
                <div class="form-group text-left"><label><b>Costo</b></label><input id="cos" type="number" class="form-control" placeholder="0.00"></div>`,
            showCancelButton:true,
            confirmButtonText:"Agregar",
            preConfirm:()=>({
                nom: nom.value,
                cos: cos.value})
        });
        if(!form) return;

        try{
            rep.agregarRepuesto(new Repuesto(form.nom, form.cos));
            emitir('rep:repuesto', {id: rep.id, repuesto: form.nom});
            persistirReparaciones();
            emitir('rep:listaActualizada', {cantidad: reparaciones.length});
            await Swal.fire("OK","Repuesto agregado","success");
            rehacerTabla();
        }
        catch(err){await Swal.fire("Error", err.message, "error");}
    }

    async function avanzarEstacion(){
        const rep = await seleccionarReparacionPorId();
        if(!rep) return;
        if(!requireTecnico(rep)) return;
        try{
            rep.avanzar();
            persistirReparaciones();
            emitir('rep:listaActualizada', {cantidad: reparaciones.length});
            await Swal.fire("OK", `Avanzó a: ${rep.estado}`, "success");
            rehacerTabla();
        }catch(err){await Swal.fire("No se puede avanzar", err.message, "error");}
    }
    
    async function marcarComoPagado(){
        const rep = await seleccionarReparacionPorId();
        if (!rep) return;

        const saldo = rep.saldoPendiente;
        if (saldo <= 0){
            await Swal.fire("Sin saldo", "Esta reparación ya está pagada.", "info");
            return;
        }

        const html = `
        <div class="text-left">
            <p><b>Total estimado:</b> ${formatearSoles(rep.totalEstimado)}</p>
            <p><b>Depósito registrado:</b> ${formatearSoles(rep.deposito)}</p>
            <hr class="my-2"/>
            <p class="mb-0"><b>Saldo pendiente:</b> ${formatearSoles(saldo)}</p>
        </div>
        `;

        const res = await Swal.fire({
            title: `Pago #${rep.id}`,
            html,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Pagado",
            cancelButtonText: "Cancelar"
        });

        if (!res.isConfirmed) return;

        rep.pagarSaldoPendiente();
        emitir('rep:pagada', {id: rep.id});
        persistirReparaciones();
        emitir('rep:listaActualizada', {cantidad: reparaciones.length});
        await Swal.fire("OK", "Pago registrado correctamente.", "success");
        rehacerTabla();
    }

    async function verHistorial(){
        const rep = await seleccionarReparacionPorId();
        if(!rep) return;
        const html = `<ul class="text-left">${rep.historial.map(h=>`<li><b>${h.estado}</b> || ${new Date(h.ts).toLocaleString()}</li>`).join("")}</ul>`;
        await Swal.fire({title:`Historial #${rep.id}`, html, width:600});
    }

    return {
        init: function({sucursalesLista=[], tecnicosLista=[], reportados={seriales:[], imeis:[]}} = {}){
            on('rep:listaActualizada', () => {rehacerTabla();});
            on('rep:estado', (e) => {
                const {id, estado} = e.detail;
                console.log(`Rep #${id} → ${estado}`);
            });
            on('session:login', () => {cargarReparaciones();});
            on('rep:creada', e => console.log('Creada', e.detail.id));
            on('rep:diagnostico', e => console.log('Diagnóstico', e.detail.id));
            on('rep:autorizada', e => console.log('Autorizada', e.detail.id));
            on('rep:tecnicoAsignado', e => console.log('Técnico asignado', e.detail));
            on('rep:pagada', e => console.log('Pagada', e.detail.id));

            RegistroReportes.cargar(reportados);
            sucursales = sucursalesLista.map(n => new Sucursal(n));
            tecnicosLista.forEach((t,i)=>{
                const tec = new Tecnico({
                    idEmpleado:`${t.dni} - ${1000+i}`,
                    nombres:t.nombres,
                    apellidos:t.apellidos,
                    sucursal:t.sucursal,
                    skills:t.skills
                });
                const suc = getSucursal(t.sucursal);
                if(suc) suc.agregarTecnico(tec);
            });

            document.getElementById("btnLogin").addEventListener("click", login);
            document.getElementById("btnLogout").addEventListener("click", logout);
            document.getElementById("btnIngresar").addEventListener("click", ingresarEquipo);
            document.getElementById("btnAsignarTecnico").addEventListener("click", asignarTecnicoManual);
            document.getElementById("btnDiagnostico").addEventListener("click", registrarDiagnostico);
            document.getElementById("btnAutorizar").addEventListener("click", autorizarYAbonar);
            document.getElementById("btnRepuesto").addEventListener("click", agregarRepuesto);
            document.getElementById("btnAvanzar").addEventListener("click", avanzarEstacion);
            document.getElementById("btnPagado").addEventListener("click", marcarComoPagado);
            document.getElementById("btnVerHistorial").addEventListener("click", verHistorial);

            // Restaurar la sesion creada
            const ses = ssGet(SS_KEYS.SESSION, null);
            if (ses){
                usuarioActual = {
                    dni: ses.dni, nombres: ses.nombres, apellidos: ses.apellidos,
                    get nombreCompleto(){
                        return `${this.nombres} ${this.apellidos}`.trim();
                    }
                };
                toggleAcciones(false);
                updateSessionUI();
                cargarReparaciones();
            } else{
                toggleAcciones(true);
                updateSessionUI();
                rehacerTabla();
            }
        }
    };
})();
