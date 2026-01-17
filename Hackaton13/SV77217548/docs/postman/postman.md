# Postman

## 1) Preparacion
1. Ejecuta el servidor:
   - `npm run dev`
2. Crea un Environment en Postman con estas variables:
   - `baseUrl` = `http://localhost:8080`
   - `apiKey` = `DEMO_KEY` (o el valor de `API_KEY` en tu `.env`)
   - `xToken` = `secret`
   - `idempotencyKey` = `pago-001`

## 2) Coleccion
Crea una collection llamada `Hackaton13-SV77217548` y agrega las siguientes requests.

## 3) Endpoints base (/api)

### 3.1 Health
- Metodo: `GET`
- URL: `{{baseUrl}}/api/health`
- Headers: ninguno

### 3.2 Data
- Metodo: `POST`
- URL: `{{baseUrl}}/api/data`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{"sample": true}
```

### 3.3 Metrics
- Metodo: `GET`
- URL: `{{baseUrl}}/api/metrics`
- Headers: ninguno

### 3.4 Stream SSE
- Metodo: `GET`
- URL: `{{baseUrl}}/api/stream`
- Headers: ninguno
- Nota: Postman muestra el stream, pero en consola es mas claro con `curl.exe`.

## 4) Endpoints v1 (requieren API key)
Agrega el header `x-api-key: {{apiKey}}` en todas las rutas `/api/v1`.

### 4.1 Usuarios - Listar
- Metodo: `GET`
- URL: `{{baseUrl}}/api/v1/users`
- Headers:
  - `x-api-key: {{apiKey}}`

### 4.2 Usuarios - Crear
- Metodo: `POST`
- URL: `{{baseUrl}}/api/v1/users`
- Headers:
  - `x-api-key: {{apiKey}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{"name": "Rony", "email": "rony@example.com"}
```

### 4.3 Usuarios - Detalle
- Metodo: `GET`
- URL: `{{baseUrl}}/api/v1/users/1`
- Headers:
  - `x-api-key: {{apiKey}}`

### 4.4 Ordenes - Listar (requiere x-token)
- Metodo: `GET`
- URL: `{{baseUrl}}/api/v1/orders?page=1&limit=5&sort=desc`
- Headers:
  - `x-api-key: {{apiKey}}`
  - `x-token: {{xToken}}`

### 4.5 Ordenes - Crear (requiere x-token)
- Metodo: `POST`
- URL: `{{baseUrl}}/api/v1/orders`
- Headers:
  - `x-api-key: {{apiKey}}`
  - `x-token: {{xToken}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{"items":[{"sku":"abc","qty":1}],"customerId":"1"}
```

### 4.6 Ordenes - Exportar CSV (requiere x-token)
- Metodo: `GET`
- URL: `{{baseUrl}}/api/v1/orders/export`
- Headers:
  - `x-api-key: {{apiKey}}`
  - `x-token: {{xToken}}`

### 4.7 Uploads - Subir avatar
- Metodo: `POST`
- URL: `{{baseUrl}}/api/v1/uploads/avatar`
- Headers:
  - `x-api-key: {{apiKey}}`
- Body:
  - `form-data`
  - Key: `avatar` (type File)
  - Archivo sugerido: `docs/img_examples/example1.png` o `docs/img_examples/example2.gif`

### 4.8 Uploads - Descargar archivo
- Metodo: `GET`
- URL: `{{baseUrl}}/api/v1/uploads/files/<storedName>`
- Headers:
  - `x-api-key: {{apiKey}}`
- Nota: `<storedName>` lo obtienes del response del upload.

### 4.9 Pagos - Crear (idempotente)
- Metodo: `POST`
- URL: `{{baseUrl}}/api/v1/payments`
- Headers:
  - `x-api-key: {{apiKey}}`
  - `Idempotency-Key: {{idempotencyKey}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{"amount": 100}
```

### 4.10 Pagos - Repetir (misma respuesta)
- Metodo: `POST`
- URL: `{{baseUrl}}/api/v1/payments`
- Headers:
  - `x-api-key: {{apiKey}}`
  - `Idempotency-Key: {{idempotencyKey}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{"amount": 100}
```
