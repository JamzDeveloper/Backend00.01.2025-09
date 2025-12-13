# Pruebas en Postman
Base URL (por defecto): `http://localhost:8080/api`

# Autenticacion (JWT)
1) Registro
- Metodo: POST
- URL: `http://localhost:8080/api/auth/register`
- Body:
```json
{"email": "user@example.com", "password": "password"}
```
- Respuesta incluye `token`.

2) Login
- Metodo: POST
- URL: `http://localhost:8080/api/auth/login`
- Body:
```json
{"email": "user@example.com", "password": "password"}
```
- Respuesta incluye `token`.

Usa `Authorization: Bearer {{token}}` en las rutas de listas.

## 1) Healthcheck
- Metodo: GET
- URL: `http://localhost:8080/health`

# Listas por usuario (usar Authorization Bearer)
- URL: `http://localhost:8080/api/listas` y agrega en cada request el header:
`Authorization: Bearer {{token}}`, así sabemos de que usuario es la lista.

## Crear lista
- Metodo: POST
- URL: `http://localhost:8080/api/listas`
- Header: `Authorization: Bearer`
- Body (raw JSON):
```json
{
  "titulo": "Compras Semana 1",
  "items": [
    {"nombre": "Arroz", "descripcion": "1kg", "fecha": "07/12/25"},
    {"nombre": "Leche", "descripcion": "2L", "fecha": "07/12/25"}
  ]
}
```

## Listar mis listas
- Metodo: GET
- URL: `http://localhost:8080/api/listas`
- Header: `Authorization: Bearer`

## Obtener una lista
- Metodo: GET
- URL: `http://localhost:8080/api/listas/{{listaId}}`
- Header: `Authorization: Bearer`

## Duplicar una lista (resetea checks)
- Metodo: POST
- URL: `http://localhost:8080/api/listas/{{listaId}}/duplicar`
- Header: `Authorization: Bearer`

## Marcar/desmarcar un item y actualizar estado
- Metodo: PATCH
- URL: `http://localhost:8080/api/listas/{{listaId}}/items/{{itemId}}`
- Header: `Authorization: Bearer`
- Body (raw JSON):
```json
{"esCompletado": true}
```

## Editar una lista completa (titulo e items)
- Metodo: PATCH
- URL: `http://localhost:8080/api/listas/{{listaId}}`
- Header: `Authorization: Bearer`
- Body (raw JSON):
```json
{
  "titulo": "Compras Semana 1 (editado)",
  "items": [
    {"_id": "{{itemId1}}", "nombre": "Arroz", "descripcion": "1kg", "fecha": "07/12/25", "esCompletado": false},
    {"_id": "{{itemId2}}", "nombre": "Leche", "descripcion": "2L", "fecha": "07/12/25", "esCompletado": true}
  ]
}
```
Notas:
- Incluye `_id` de cada item si ya existe; si omites `_id` se asignará uno nuevo.
- `fecha` acepta `dd/mm/aa`.

## Eliminar lista (soft delete)
- Metodo: DELETE
- URL: `http://localhost:8080/api/listas/{{listaId}}`
- Header: `Authorization: Bearer`
