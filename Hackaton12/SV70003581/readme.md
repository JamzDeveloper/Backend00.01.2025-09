## Agregar lista de compra:
POST:   http://localhost:4000/api/lista
Body:   {
  "name": "Venta D",
  "description": "Cliente Y",
  "date": "2025-12-17",
  "esCompletado": false
}

## Listar todas las listas:
GET:    http://localhost:4000/api/lista

## Listar solo listas completadas
GET:    http://localhost:4000/api/lista?completados==true

## Listar solo listas no completadas
GET:    http://localhost:4000/api/lista?completados==false

* Hay seed precargada.