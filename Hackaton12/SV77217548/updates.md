## v0.4 - Persistencia y filtros por query
- Se agrega persistencia en archivo `listSales.json` (lectura al iniciar y guardado en POST/PUT/DELETE).
- `GET /api/lista` ahora acepta query param `status=pendiente|completado` para filtrar.

## v0.3 - IDs con crypto y métodos PUT, DELETE
- Se agrega `id` autogenerado en cada registro creado.
- Se implementan endpoints: `PUT /api/lista/:id` para actualizar `esCompletado` y `DELETE /api/lista/:id` para eliminar.
- Validación en PUT para `esCompletado` boolean; respuestas 400 por JSON invalido o campos faltantes, 404 si el id no existe.

## v0.2 - Endpoints requeridos
- Se implementa `GET /api/lista/pendientes` y `GET /api/lista/completados` filtrando por `esCompletado`.
- Se implementa `POST /api/lista` con validación de tipos para `name`, `description`, `date` y `esCompletado`.
- Manejo de JSON inválido con respuesta 400 `{"message": "invalid json"}` y 400 `{"message": "faltan campos"}` cuando faltan campos o tipos.

## v0.1 - Inicio de Hackaton
- Servidor HTTP básico con `GET /api/lista` que devuelve `listSales`.
- Respuesta JSON con `404` y mensaje `{"message": "endpoint not found"}` para rutas inexistentes.
- Documento de ejecución y alcance actual en `README.md`.
