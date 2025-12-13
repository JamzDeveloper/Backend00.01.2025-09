# Hackaton10 - Lista de compras (MongoDB)
API con autenticacion JWT y listas de compras por usuario. Cada lista contiene productos con estado pendiente/en_proceso/terminado, duplicacion de listas y marcado de items.

## Requisitos
- Node.js 18+
- MongoDB accesible (Atlas o local)
- Variables en `.env` (ver `.env.example`):
  - `MONGOURI`, `DB_NAME`, `LISTS_COLLECTION`, `USERS_COLLECTION`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`.

## Scripts
- `npm run dev` levanta la API con nodemon.
- `npm start` levanta la API con node.

## Rutas (prefijo `/api`)
### Auth
- `POST /auth/register` `{email, password}` (min 5). Devuelve `token`.
- `POST /auth/login` `{email, password}`. Devuelve `token`.

### Listas (requiere header `Authorization: Bearer <token>`)
- `GET /listas` listas del usuario.
- `POST /listas` crea lista con items pendientes. Body: `{ "titulo": "...", "items": [ { "nombre": "...", "descripcion": "...", "fecha": "dd/mm/aa" }, ... ] }`.
- `GET /listas/:id` obtiene lista del usuario.
- `POST /listas/:id/duplicar` duplica la lista, resetea los checks a pendiente.
- `PATCH /listas/:id` edita titulo e items completos de la lista. Body: `{ "titulo": "...", "items": [ { "_id": "opcional", "nombre": "...", "descripcion": "...", "fecha": "dd/mm/aa", "esCompletado": true|false }, ... ] }`. Recalcula el estado segun los checks.
- `PATCH /listas/:id/items/:itemId` body `{ "esCompletado": true|false }`, recalcula estado de la lista.
- `DELETE /listas/:id` marca la lista como eliminada (soft delete).

## Estructura
- `src/` API Express + Mongo (controllers, routes, middlewares, utils).
- `web/` frontend estatico para probar el flujo (sin build).
- `docs/postman.md` coleccion manual de requests.

## Frontend (carpeta `web`)
- Abre `web/index.html` (usa live server o `npx serve web`).
- Ajusta la API en la barra superior (`http://localhost:8080/api` por defecto).
- Flujo soportado: registro/login (guarda JWT), ver listas, crear lista con productos (nombre, descripcion, fecha dd/mm/aa), marcar/desmarcar productos (actualiza estado), duplicar lista, eliminar lista (soft delete) y editar titulo/items desde el boton “Editar”.

## Notas
- La base y colecciones se crean al primer write (si el usuario tiene permisos).
- Las fechas de productos se envian como `dd/mm/aa` y se guardan como `Date`.
- Las listas se eliminan con soft delete: se marcan como eliminadas, no se borran físicamente.
