# Coleccion Postman (paso a paso con seed)

Guia breve para probar todo en Postman usando el seed incluido.

## 0) Preparar API y seed
1. Empezamos corriendo:
   ```bash
   npm run seed
   npm run dev
   ```
   El seed imprime los IDs creados para materiales, insumos y empleados; podemos tomar nota de ellos para pruebas.
2. Asegurate de que la API este arriba en `http://127.0.0.1:6969` (o el puerto que tengas en `.env`).

## 1) Configurar entorno en Postman
Se puede crear un environment llamado por ejemplo, `sv77217548` con estas variables:
```
baseUrl = http://127.0.0.1:6969
materialId = <ID de material>
supplyId = <ID de insumo>
employeeId = <ID de empleado>
productionId = <ID de produccion>
```

## 2) Requests

### Ping API
- **GET** `{{baseUrl}}/`

### Materias primas
- **POST** `{{baseUrl}}/api/materials`
  Body (raw JSON):
  ```json
  {
    "name": "Tablon de abeto",
    "description": "Tablon 3m x 30cm",
    "stock": 10,
    "unit": "tablon"
  }
  ```
- **GET** `{{baseUrl}}/api/materials`
- **GET** `{{baseUrl}}/api/materials/{{materialId}}`
- **PATCH** `{{baseUrl}}/api/materials/{{materialId}}`
  ```json
  {
    "description": "Tablon actualizado",
    "stock": 12
  }
  ```
- **POST** `{{baseUrl}}/api/materials/{{materialId}}/purchase`
  ```json
  {
    "quantity": 5
  }
  ```
- **DELETE** `{{baseUrl}}/api/materials/{{materialId}}`

### Insumos
- **POST** `{{baseUrl}}/api/supplies`
  ```json
  {
    "name": "Goma industrial",
    "description": "Goma blanca para muebles",
    "stockKg": 5,
    "unit": "kg"
  }
  ```
- **GET** `{{baseUrl}}/api/supplies`
- **GET** `{{baseUrl}}/api/supplies/{{supplyId}}`
- **PATCH** `{{baseUrl}}/api/supplies/{{supplyId}}`
  ```json
  {
    "description": "Goma ajustada",
    "stockKg": 6.5
  }
  ```
- **POST** `{{baseUrl}}/api/supplies/{{supplyId}}/purchase`
  ```json
  {
    "quantity": 2.5
  }
  ```
- **DELETE** `{{baseUrl}}/api/supplies/{{supplyId}}`

### Empleados
- **POST** `{{baseUrl}}/api/employees`
  ```json
  {
    "name": "Operario 1",
    "role": "carpintero",
    "availableHours": 40,
    "hourlyRate": 15
  }
  ```
- **GET** `{{baseUrl}}/api/employees`
- **GET** `{{baseUrl}}/api/employees/{{employeeId}}`
- **PATCH** `{{baseUrl}}/api/employees/{{employeeId}}`
  ```json
  {
    "role": "ensamblador",
    "hourlyRate": 16
  }
  ```
- **POST** `{{baseUrl}}/api/employees/{{employeeId}}/register-hours`
  ```json
  {
    "hours": 4
  }
  ```
- **DELETE** `{{baseUrl}}/api/employees/{{employeeId}}`

### Produccion
- **POST** `{{baseUrl}}/api/productions`
  ```json
  {
    "quantity": 2,
    "materialId": "{{materialId}}",
    "supplyId": "{{supplyId}}",
    "employeeId": "{{employeeId}}",
    "notes": "Lote de validacion"
  }
  ```
  Guarda el `_id` que devuelve en la respuesta y colocalo en la variable `productionId` del Environment.

- **GET** `{{baseUrl}}/api/productions`
- **GET** `{{baseUrl}}/api/productions/{{productionId}}`