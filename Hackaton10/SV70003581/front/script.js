document.getElementById("getButton").addEventListener("click", () => { cargarItems(2); });
document.getElementById("getPendingsButton").addEventListener("click", () => { cargarItems(0); });
document.getElementById("getCompleteButton").addEventListener("click", () => { cargarItems(1); });
document.getElementById("getIdButton").addEventListener("click", () => { cargarItems(3); });
let opcionGet = { 0: "/api/items/pendings", 1: "/api/items/completed", 2: "/api/items", 3: "/api/items" };

async function cargarItems(opc = 2) {
    try {
        let endpoint = opcionGet[opc];

        if (opc === 3) {
            const id = document.getElementById("idItem").value.trim();
            if (!id) return alert("Ingrese un ID");
            endpoint = `/api/items/${id}`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        const lista = document.getElementById('tabla-items');
        lista.innerHTML = '';

        if (opc === 3) {
            const tr = document.createElement('tr');
            let cB = `<input type="checkbox">`
            if (data.completado) { cB = `<input type="checkbox" id="${data._id}" onchange="actualizarItem('${data._id}')" checked>`; } else { cB = `<input type="checkbox" id="${data._id}" onchange="actualizarItem('${data._id}')">`; }
            tr.innerHTML = `
            <td>${cB}</td>            
            <td>${data._id}</td>
            <td>${data.nombre}</td>
            <td>${data.descripcion}</td>
            <td>${data.fecha}</td>
            <td><button type="button" onclick="eliminarItem('${data._id}')">Eliminar</button></td>
        `;
            lista.appendChild(tr);

        } else {

            let cB = `<input type="checkbox">`;

            data.forEach(item => {
                const tr = document.createElement('tr');
                if (item.completado) { cB = `<input type="checkbox" id="${item._id}" onchange="actualizarItem('${item._id}')" checked>`; } else { cB = `<input type="checkbox" id="${item._id}" onchange="actualizarItem('${item._id}')">`; }
                tr.innerHTML = `                
                <td>${cB}</td>
                <td>${item._id}</td>
                <td>${item.nombre}</td>
                <td>${item.descripcion}</td>
                <td>${item.fecha}</td>                
                <td><button type="button" onclick="eliminarItem('${item._id}')">Eliminar</button></td>
            `;
                lista.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error cargando items:', error);
    }
}

cargarItems();


// AGREGAR ITEM: Solo se usará la agregación de uno por uno tal como se solicitó en el readme.md

divFormulario = document.getElementById("formulario");
divFormulario.style.display = "none";
showButton = document.getElementById("showButton");
showButton.addEventListener("click", () => { divFormulario.style.display = "block"; showButton.style.display = "none"; });
document.getElementById("addButton").addEventListener("click", () => { agregarItem(); });

async function agregarItem() {
    try {
        let nombre = document.forms["form01"]["title"].value.trim();
        let descripcion = document.forms["form01"]["descripcion"].value.trim();

        if (!nombre || !descripcion) { return alert("Completa todos los campos"); }

        await fetch("/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion })
        });

        cargarItems();
        divFormulario.style.display = "none";
        showButton.style.display = "block";
        document.forms["form01"]["title"].value = "";
        document.forms["form01"]["descripcion"].value = "";
    } catch (error) {
        console.error('Error agregando item:', error);
    }
}


// EDITAR ITEM

async function actualizarItem(id) {
    try {
        let elemento = document.getElementById(id);
        let completado = false;

        if (elemento.checked) {
            completado = true;
        } else {
            completado = false;
        }

        await fetch(`/api/items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completado })
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// ELIMINAR ITEM

async function eliminarItem(id) {
    try {
        const resp = await fetch(`/api/items/${id}`, {
            method: "DELETE"
        });
        cargarItems();

    } catch (error) {
        console.error("Error:", error);
    }
}