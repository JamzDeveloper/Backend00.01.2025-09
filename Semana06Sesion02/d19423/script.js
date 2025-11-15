console.log("Inicio de la aplicacion");
let arrKits = [];
let $table = $("#table");
class Kit {
    constructor(nombre, descripcion, escala, imagen, isCustom, custom) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.escala = escala;
        this.imagen = imagen;
        this.isCustom = isCustom;
        this.custom = custom;
    }
}

function IsCustomCheck(event) {
    console.log("Cambio el Check");
    if (event.checked) {
        $("#divCustom").toggle(1500);
    } else {
        $("#divCustom").toggle(1500);
    }
}

$("#btnAgregar").click(async function () { 

    console.log("Agregar kit");
    const { value: formValues } = await Swal.fire({
        title: "Ingresa los datos de tu Kit",
        icon: "info",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        html: `<div class="form-group">
        <input type="text" id="nombre" placeholder="Escribe el nombre del Kit">
    </div>
    <div class="form-group">
        <input type="text" id="descripcion" placeholder="Escribe la descripcion del Kit">
    </div>
    <div class="form-group">
        <input type="text" id="escala" placeholder="Escribe la escala del Kit">
    </div>
    <div class="form-group">
        <input type="text" id="imagen" placeholder="Escribe nombre de la imagen del Kit">
    </div>
    <div class="form-group">
        <label for="checkboxes-0" class="checkbox-inline">
            <input type="checkbox" name="" id="chkIsCustom" onchange="IsCustomCheck(this)" value="SI">
            SI es Custom
        </label>
    </div>
    <div class="form-group" id="divCustom" style="display: none;">
        <input type="text" id="custom" placeholder="Escribe el custom del Kit">
    </div>`,
        preConfirm: () => {
            return {
                nombre: $("#nombre").val(),
                descripcion: $("#descripcion").val(),
                escala: $("#escala").val(),
                imagen: $("#imagen").val(),
                isCustom: $("#chkIsCustom:checked").val() == "SI" ? true : false,
                custom: $("#custom").val().split(';')
            }
        }
    });
    console.log(formValues);
    if (formValues) {
        let objKit = new Kit(
            formValues.nombre,
            formValues.descripcion,
            formValues.escala,
            formValues.imagen,
            formValues.isCustom,
            formValues.custom
        )
        console.log(objKit)
        arrKits.push(JSON.parse(JSON.stringify(objKit)));
        localStorage.setItem('inventarioKits', JSON.stringify(arrKits));
        $table.bootstrapTable('load', arrKits);
    }
});

$(document).ready(() => {
    let strLocal = localStorage.getItem('inventarioKits');
    if (strLocal !== null) arrKits = JSON.parse(strLocal);
    $table.bootstrapTable({ data: arrKits });
    // arrKits = JSON.parse(!=null?localStorage.getItem('inventarioKits'):[]);
})

$("#btnEliminarTodo").click(async function () {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            arrKits = [];
            localStorage.setItem('inventarioKits', JSON.stringify(arrKits));
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
})

function detailFormatter(index, row) {
    console.log(row);
    let html = [];
    $.each(row, (key, value)=>{
        switch (key) {
            case "imagen":
                html.push(`<img src="img/${value}.webp" width="300px" />`)
                break;
            case "isCustom":
                if(value){
                    let htmlStr = `<b>MODIFICACIONES</b><ul>`;
                    console.log(row.custom)
                    $.each(row.custom, (a,b)=>{
                        htmlStr += `<li>${b}</li>`
                    })
                    htmlStr += `</ul>`
                    html.push(`<p>${htmlStr}</p>`)
                }
            case "custom":
                break;
            default:
                html.push(`<p><b> ${key.toUpperCase()}: </b> ${value} </p> `)
                break;
        }
    })
    return html.join('');
}
window.accionEvents={
    'click .edit': (e,value, row,index)=>{
        console.log("Editar")
    },
    'click .delete': (e,value, row,index)=>{
        let inx = arrKits.indexOf(row);
        if(inx > -1) arrKits.splice(inx,1);

        localStorage.setItem('inventarioKits', JSON.stringify(arrKits));
        $table.bootstrapTable('load', arrKits);
    }
}

function accionFormatter(value, row, index){
return [
    `<a class="edit" href="javascript:void(0)" title="edit">`,
    `<i class="fas fa-edit" </i> </a>`,
    `<a class="delete" href="javascript:void(0)" title="delete">`,
    `<i class="fas fa-trash" </i> </a>`
].join('');
}
