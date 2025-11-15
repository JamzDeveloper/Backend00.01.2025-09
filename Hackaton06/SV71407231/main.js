class Telefono {

    constructor(imei){
        this.imei = imei;
    } 

    imeiTieneReporte () {
        return this.imei > 0.5 ? true : false
    }

}

window.addEventListener('load', () => {


    const estadoPrevio = sessionStorage.getItem('estadoActual');
    const diagnosticoPrevio = localStorage.getItem('diagnosticoGuardado');
    const tecnicoPrevio = sessionStorage.getItem('tecnico');

    if (estadoPrevio) document.querySelector('#estadoActual').textContent = estadoPrevio;
    if (diagnosticoPrevio) document.querySelector('#diagnosticoGuardadoTexto').textContent = diagnosticoPrevio;
    if (tecnicoPrevio) document.querySelector('#tecnico').textContent = tecnicoPrevio;


    const contenedor = document.querySelector('#historial');
    contenedor.innerHTML = "<h3>Historial de diagnósticos:</h3>";
    
    const imeiGuardado = localStorage.getItem('imei');
    const modeloGuardado = localStorage.getItem('modelo');
    
    if (imeiGuardado || modeloGuardado) {
        const contenedor = document.querySelector('#historial');
            contenedor.innerHTML += `<p><strong>Ultimo IMEI registrado:</strong> ${imeiGuardado || 'No especificado'}</p>`;
            contenedor.innerHTML += `<p><strong>Ultimo Celular registrado:</strong> ${modeloGuardado || 'No registrado'}</p><hr>`;
    }
        
       

    const historialGuardado = JSON.parse(localStorage.getItem('historialDiagnosticos')) || [];
    historialGuardado.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `IMEI: ${item.imei} — Modelo: ${item.modelo} — ${item.tecnico} — ${item.diagnostico}`;
        contenedor.appendChild(p);
    });    

});


const robado = new Telefono(Math.random());
const cuadro = document.querySelector('#formulario-cuadro');

const estadoActual = document.querySelector('#estadoActual');
const repuestos = document.querySelector('#repuestos');

const diagnosticoGuardadoTexto = document.querySelector('#diagnosticoGuardadoTexto');

// console.log(robado.imei)

const btnVerificar = document.querySelector('#btnVerificar'); 

btnVerificar.addEventListener('click', () => {

    const campoImei = document.querySelector('#campo-imei');
    
    estadoActual.textContent = 'Verificando IMEI...';   
    if(robado.imeiTieneReporte() === false){
        localStorage.setItem('imei', campoImei.value); 
        cuadro.classList.remove('oculto');
        btnVerificar.disabled = true; 
        estadoActual.textContent = 'Equipo en diagnóstico inicial.';
    }else {
        alert('imei reportado.')
        estadoActual.textContent = 'IMEI bloqueado. No se puede continuar. Refresque la pagina';
    }; 
    
})

const btnGuardarDiagnostico = document.querySelector('#diagnosticoGuardado');

const formularioConfirmacion = document.querySelector('#formulario-confirmacion');
const tecnicoAsignado = document.querySelector('#tecnico');
const btnConfirmarPago = document.querySelector('#btnConfirmarPago');


btnGuardarDiagnostico.addEventListener('click',(event) => {
    event.preventDefault();
    const sistema = document.querySelector('#sistema').value.trim().toLowerCase();

    const textoDiagnostico = document.querySelector('#diagnostico').value.trim();

    // if(robado.imeiTieneReporte() === false){
    //     cuadro.className('oculto');
        
    // }

    if (sistema !== 'android' && sistema !== 'ios') {
    alert("Solo se permite ingresar 'Android' o 'iOS'.");
    return;
    }


    localStorage.setItem('diagnosticoGuardado', textoDiagnostico || "Sin diagnóstico especificado.");

    diagnosticoGuardadoTexto.textContent = textoDiagnostico || "Sin diagnóstico especificado.";


    cuadro.classList.add('oculto');
    formularioConfirmacion.classList.remove('oculto');


    const tecnico = sistema === 'ios' ? 'Valentina' : 'Harold';
    tecnicoAsignado.textContent = `Técnico asignado: ${tecnico}`;

    sessionStorage.setItem('tecnico', tecnicoAsignado.textContent);


    estadoActual.textContent = 'Esperando abono del cliente.';
    sessionStorage.setItem('estadoActual', 'Esperando abono del cliente.');

    let historial = JSON.parse(localStorage.getItem('historialDiagnosticos')) || [];
    historial.push({
        imei: localStorage.getItem('imei'),
        modelo: document.querySelector('#modelo').value.trim(),
        diagnostico: textoDiagnostico,
        tecnico: tecnicoAsignado.textContent
    });
    localStorage.setItem('historialDiagnosticos', JSON.stringify(historial));


    const imeiGuardado = localStorage.getItem('imei');
    const modelo = document.querySelector('#modelo').value.trim();
    localStorage.setItem('modelo', modelo);



    const historialGuardado = JSON.parse(localStorage.getItem('historialDiagnosticos')) || [];
    const contenedor = document.querySelector('#historial');

    contenedor.innerHTML = "";

    if (imeiGuardado && modelo) {
        contenedor.innerHTML += `<p><strong>IMEI registrado:</strong> ${imeiGuardado}</p>`;
        contenedor.innerHTML += `<p><strong>Celular:</strong> ${modelo}</p><hr>`;
    }


    historialGuardado.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `IMEI: ${item.imei} — Modelo: ${item.modelo} — ${item.tecnico} — ${item.diagnostico}`;
        contenedor.appendChild(p);
    });

    
    
})

btnConfirmarPago.addEventListener('click', ( ) => {

  alert('Pago confirmado. El servicio ha sido registrado correctamente.');
  
  formularioConfirmacion.classList.add('oculto');
  repuestos.classList.remove('oculto');
  estadoActual.textContent = 'En reparación. Repuestos agregados.';
  sessionStorage.setItem('estadoActual', 'En reparación. Repuestos agregados.');
});




