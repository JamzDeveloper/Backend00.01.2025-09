## Instalación y ejecución

### 1. Clonar el repositorio o descargar el proyecto
```bash
git clone <https://github.com/Harold-11/Backend00.01.2025-09.git>
cd Hackaton12/SV71407231
```

### 2. Desde la raíz del proyecto, ejecutar:
```
node index.js
Si el servidor se inicia correctamente, se mostrará el siguiente mensaje en consola:
http://localhost:3000
```

### 3. Endpoints disponibles

```
- Obtener todas las ventas/tareas
GET
http://localhost:3000/api/lista
Respuesta exitosa (200):
[]
 
- Obtener ventas/tareas pendientes
GET
http://localhost:3000/api/lista/pendientes
Devuelve únicamente los registros con esCompletado === false

- Obtener ventas/tareas completadas
GET
http://localhost:3000/api/lista/completados
Devuelve únicamente los registros con esCompletado === true

- Crear una nueva venta/tarea
POST
http://localhost:3000/api/lista

Body (ejemplo):
{
  "name": "Venta A",
  "description": "Cliente X",
  "date": "2025-12-17",
  "esCompletado": false
}

Respuesta esperada:
Status: 201 Created
Retorna el objeto creado en formato JSON
```
### 4. Validaciones y manejo de errores

```

Si falta alguno de los campos obligatorios (name, description, date, esCompletado):
Status: 400 Bad Request
Respuesta:
{ "message": "faltan campos" }

Si el JSON enviado es inválido:
Status: 400 Bad Request
Respuesta:
{ "message": "JSON inválido" }

Si el endpoint solicitado no existe:
Status: 404 Not Found
Respuesta:
{ "message": "endpoint not found" }


```