# Hackaton12 - API de Gestión de Ventas

## Requisitos
- Node.js 18+

## Cómo ejecutar
```bash
node server.js
```
El servidor arranca por defecto en `http://localhost:3000` (puedes cambiar el puerto con la variable de entorno `PORT`).

## Endpoints (v0.4)
- `GET /api/lista` -> devuelve todo `listSales`. Soporta query param `status=pendiente|completado`.
- `GET /api/lista/pendientes` -> filtra items con `esCompletado === false`.
- `GET /api/lista/completados` -> filtra items con `esCompletado === true`.
- `POST /api/lista` -> crea un registro con `id` autogenerado.
  - Body ejemplo:
    ```json
    {
      "name": "Venta 1",
      "description": "Productos 1",
      "date": "2025-12-18",
      "esCompletado": true
    }
    ```
  - Validación: `name`, `description`, `date` deben ser `string`; `esCompletado` debe ser `boolean`.
  - Respuestas:
    - 201 con el item creado.
    - 400 `{"message": "faltan campos"}` si hay campos faltantes o tipos incorrectos.
    - 400 `{"message": "invalid json"}` si el body no es JSON valido.
- `PUT /api/lista/:id` -> actualiza `esCompletado` de un item.
  - Body: `{"esCompletado": true}` (o `false`).
  - Respuestas: 200 con el item actualizado; 400 por validación; 404 si el `id` no existe.
- `DELETE /api/lista/:id` -> elimina un item por `id`. Responde 200 con el item eliminado o 404 si no existe.

Rutas inexistentes responden 404 `{"message": "endpoint not found"}`.

### Persistencia
- Los datos se guardan en `listSales.json` en la raiz del proyecto. Si no existe, se arranca con arreglo vacio. Cada cambio (POST/PUT/DELETE) sobrescribe el archivo.
