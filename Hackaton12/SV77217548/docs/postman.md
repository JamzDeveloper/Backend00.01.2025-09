# Colección manual para probar la API (v0.4)

Base URL por defecto: `http://localhost:3000` (ajusta si usas otra variable `PORT`).

## 1) GET /api/lista
- URL: `GET {{baseUrl}}/api/lista`
- Respuesta esperada: `200` con el arreglo completo.
- Variante con filtros por query:
  - Pendientes: `GET {{baseUrl}}/api/lista?status=pendiente`
  - Completados: `GET {{baseUrl}}/api/lista?status=completado`

## 2) GET /api/lista/pendientes
- URL: `GET {{baseUrl}}/api/lista/pendientes`
- Respuesta esperada: `200` solo items con `esCompletado: false`.

## 3) GET /api/lista/completados
- URL: `GET {{baseUrl}}/api/lista/completados`
- Respuesta esperada: `200` solo items con `esCompletado: true`.

## 4) POST /api/lista
- URL: `POST {{baseUrl}}/api/lista`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Venta 1",
  "description": "Productos 1",
  "date": "2025-12-18",
  "esCompletado": false
}
```
- Respuesta esperada: `201` con el item creado (incluye `id`).
- Errores a validar:
  - `400 { "message": "faltan campos" }` si falta o es incorrecto un campo.
  - `400 { "message": "invalid json" }` si el body no es JSON válido.

## 5) PUT /api/lista/:id
- URL: `PUT {{baseUrl}}/api/lista/{{id}}`
- Headers: `Content-Type: application/json`
- Body:
```json
{ "esCompletado": true }
```
- Respuesta esperada: `200` con el item actualizado.
- Errores: `400` por validación/JSON inválido, `404` si el `id` no existe.

## 6) DELETE /api/lista/:id
- URL: `DELETE {{baseUrl}}/api/lista/{{id}}`
- Respuesta esperada: `200` con el item eliminado.
- Errores: `404` si el `id` no existe.

## Notas para capturas
- Muestra los headers `Content-Type: application/json`.
- Verifica que tras POST/PUT/DELETE el archivo `listSales.json` se actualiza en disco (persistencia).
- Incluye capturas de respuestas 400/404 para evidenciar manejo de errores.
