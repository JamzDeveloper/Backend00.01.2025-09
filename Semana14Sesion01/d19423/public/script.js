console.log("Inicio de la aplicacion")

window.addEventListener('load',init, false);

function init(){
    console.log("Termino de cargar la pagina")
    wsConnect()
}

function wsConnect(){
    console.log("Se va a conectar al WebSocket");

    websocket = new WebSocket("ws://localhost:8000");
    websocket.onopen=function(evt){
        onOpen(evt);
    }
    websocket.onclose = function(evt){
        onClose(evt);
    }
    websocket.onerror = function(evt){
        console.error(evt);
    }

    websocket.onmessage = function(evt){
        onMessage(evt);
    }
}


function onMessage(evt){

    let objMensaje = JSON.parse(evt.data);
    switch (objMensaje.message) {
        case 'clima':
            document.body.style.backgroundImage=`url(${objMensaje.answer.bg_image})`;
            document.body.style.backgroundSize = "auto";
            let txto = "";
            for(var k in objMensaje.answer) {
                console.log(k, objMensaje.answer[k]);
                txto+=`${k} --> ${objMensaje.answer[k]}`+"\n"
            }
    
            document.getElementById("mensajes").append(txto+ "\n");

            break;
    
        default:
            document.getElementById("mensajes").append(objMensaje.message + "\n");

            break;
    }


    
}

function onOpen(evt){
    document.getElementById("enviar").disabled=false;
    console.log("Conexion abierta");
}

function onClose(evt){
    console.log("Conexion Cerrada");
    document.getElementById("enviar").disabled=true;
    setTimeout(()=>{
        wsConnect();
    },2000)
}

function doSend(msg){
    let objMensaje = {};
    if(msg.indexOf('clima')>-1){
        objMensaje.message = "clima";
        objMensaje.query = msg.split(",")[1];
    }else{
        objMensaje.message= msg
    }
    websocket.send(JSON.stringify(objMensaje))
}

function enviarTexto(event){
    event.preventDefault();
    let campo = event.target.texto;
    doSend(campo.value);
    campo.value ="";
}