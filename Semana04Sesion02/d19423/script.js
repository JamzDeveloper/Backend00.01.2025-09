
let arrPedidos = [];
let arrDespacho = [];
let $tblPreparacion = $("#tblPreparacion");
let $tblDespacho = $("#tblDespacho");


const Heladeria = function (){

    let Nombre, Direccion;

    function configurar(){
        document.getElementById("nombreLocal").innerText = Nombre;
        $("#direccionLocal").text(Direccion);
        $tblPreparacion.bootstrapTable({data: arrPedidos});
        $tblDespacho.bootstrapTable({data: arrDespacho});
    }
    function eventos() {



        $("#btnPedidos").on("click",async (e)=>{
            e.preventDefault();
            console.log("Hizo click en Pedido");
            let strHtml = `<div class="form-group">
  
  <input id="txtNombre" name="txtNombre" type="text" placeholder="Escribe tu nombre" class="form-control input-md" required="">
            <input id="txtTelefono" name="txtNombre" type="text" placeholder="Escribe tu Telefono" class="form-control input-md" required="">
            <input id="txtSabor" name="txtNombre" type="text" placeholder="Escribe el Sabor" class="form-control input-md" required="">
            <input id="txtTamaño" name="txtNombre" type="text" placeholder="Escribe el Tamaño" class="form-control input-md" required="">
            <input id="txtToppins" name="txtNombre" type="text" placeholder="Escribe tus Toppis" class="form-control input-md" required="">
</div>`;
            const {value: formValues} = await Swal.fire({
                title: "Ingresa tus Datos",
                icon: "info",
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: "Guardar",
                denyButtonText: "Cancelar",
                html: strHtml,
                preConfirm:()=>{
                    return{
                        nombre: $("#txtNombre").val(),
                        telefono: $("#txtTelefono").val(),
                        sabor: $("#txtSabor").val(),
                        tamaño: $("#txtTamaño").val(),
                        toppins: $("#txtToppins").val()
                    }
                }
            });
            if(formValues){
                console.log(formValues);
                let objCliente = {
                    nombre: formValues.nombre,
                    telefono: formValues.telefono,
                    pedido:{
                        sabor: formValues.sabor,
                        tamaño: formValues.tamaño,
                        toppins: formValues.toppins
                    },
                    pagado: false
                }
                console.log(objCliente);
                arrPedidos.push(objCliente);
            }
            console.log(arrPedidos)
            $tblPreparacion.bootstrapTable('load', arrPedidos);
            $("#divPreparacion").show();
        });

        $("#btnVerPedidos").on("click",(e)=>{
            e.preventDefault();
          $("#areaDespacho").toggle();
        })
    }

    return {
        init: function(parametros){
            console.log(parametros)
            Nombre = parametros.nombre;
            Direccion = parametros.direccion;
            configurar();
            eventos();

        }
    }
}();  

function preparacionFormatter(value, row,index){
    return [
        '<a class="despachar" href="javascript:void(0)" title="Despachar">'
        ,'<i class="fa-thin fa-truck">Despachar</i></a><br>'
        ,'<a class="eliminar" href="javascript:void(0)" title="Eliminar">'
        ,'<i class="fa-thin fa-trash">Eliminar</i></a>'
    ].join('');
}

window.preparacionEvents={
    'click .despachar': function(e,value,row,index){
        console.log(e);
        console.log(value);
        console.log(index);
        despachar(row);

    },
    'click .eliminar': function(e,value,row,index){
        eliminar(row)
    }
}

function despachar(row){
    console.log(row)
    arrDespacho.push(row);
    let index = arrPedidos.indexOf(row);
    if(index >-1){
        arrPedidos.splice(index,1);
    }
    $tblPreparacion.bootstrapTable('load', arrPedidos);
    $tblDespacho.bootstrapTable('load', arrDespacho);
}
function eliminar(row){
    let index = arrPedidos.indexOf(row);
    if(index >-1){
        arrPedidos.splice(index,1);
    }
    $tblPreparacion.bootstrapTable('load', arrPedidos);
}

function despachoFormatter(value, row,index){
    return [
        '<a class="pagar" href="javascript:void(0)" id="btnDespachar" title="Despachar">'
        ,'<i class="fa-thin fa-truck">Pagar</i></a><br>'
    ].join('');
}

window.despachoEvents={
    'click .pagar': function(e,value,row,index){
        pagar(row);
    }
}

function pagar(row){
   let index = arrDespacho.indexOf(row);
    if(index >-1){
        arrDespacho[index].pagado = true;;
    }
    $tblDespacho.bootstrapTable('load', arrDespacho);
}

function pagadoFormatter(value, row,index){
    console.log(row.pagado)
    if(row.pagado){
        return [
            '<a href="#" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span> Pagado</a>'
        ].join('');
    }else{
        return [
            '<a href="#" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span> No Pagado</a>'
        ].join('');
    }
}