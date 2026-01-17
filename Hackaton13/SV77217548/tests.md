# Tests

## v0.1
1. Instalar dependencias:
   - `npm install`
2. Correr servidor:
   - `npm run dev`
3. Health:
   - `curl.exe http://localhost:8080/api/health`
   - Respuesta esperada: `{"status": "ok"}`
4. Data con JSON:
   - `curl.exe -X POST http://localhost:8080/api/data -H "Content-Type: application/json" -d '{"sample":true}'`
   - Respuesta esperada: `{"received": true}`
5. Data sin JSON (va a fallar):
   - `curl.exe -X POST http://localhost:8080/api/data -d '{"sample":true}'`
   - Respuesta esperada: 415 con mensaje sobre el Content-Type.

## v0.2
1. Crear usuario:
   - `curl.exe -X POST http://localhost:8080/api/v1/users -H "Content-Type: application/json" -d '{"name":"Rony","email":"rony@example.com"}'`
2. Listar usuarios:
   - `curl.exe http://localhost:8080/api/v1/users`
3. Obtener usuario por id:
   - `curl.exe http://localhost:8080/api/v1/users/1`
4. Ordenes sin header (va a fallar):
   - `curl.exe http://localhost:8080/api/v1/orders`
   - Respuesta esperada: 401 con mensaje de auth.
5. Crear orden (header requerido):
   - `curl.exe -X POST http://localhost:8080/api/v1/orders -H "Content-Type: application/json" -H "x-token: secret" -d '{"items":[{"sku":"abc","qty":1}],"customerId":"1"}'`
6. Listar ordenes con paginacion:
   - `curl.exe "http://localhost:8080/api/v1/orders?page=1&limit=5&sort=desc" -H "x-token: secret"`
7. Exportar CSV:
   - `curl.exe http://localhost:8080/api/v1/orders/export -H "x-token: secret"`

## v0.3
1. Subir avatar con ejemplos:
   - PNG: `curl.exe -X POST http://localhost:8080/api/v1/uploads/avatar -F "avatar=@docs\\img_examples\\example1.png"`
   - GIF: `curl.exe -X POST http://localhost:8080/api/v1/uploads/avatar -F "avatar=@docs\\img_examples\\example2.gif"`
2. Descargar archivo:
   - PNG:  `curl.exe -o example1.png http://localhost:8080/api/v1/uploads/files/<storedName>`
   - GIF:  `curl.exe -o example2.gif http://localhost:8080/api/v1/uploads/files/<storedName>`
3. Pago idempotente (primera vez):
   - `curl.exe -X POST http://localhost:8080/api/v1/payments -H "Content-Type: application/json" -H "Idempotency-Key: pago-001" -d '{"amount":100}'`
4. Pago idempotente (repetir, misma respuesta):
   - `curl.exe -X POST http://localhost:8080/api/v1/payments -H "Content-Type: application/json" -H "Idempotency-Key: pago-001" -d '{"amount":100}'`
5. Metricas:
   - `curl.exe http://localhost:8080/api/metrics`

## v0.4
1. API key requerida (va a fallar):
   - `curl.exe http://localhost:8080/api/v1/users`
   - Respuesta esperada: 401 o 403.
2. Listar usuarios con API key:
   - `curl.exe http://localhost:8080/api/v1/users -H "x-api-key: DEMO_KEY"`
3. Crear usuario con API key:
   - `curl.exe -X POST http://localhost:8080/api/v1/users -H "Content-Type: application/json" -H "x-api-key: DEMO_KEY" -d '{"name":"Olenka","email":"olenka@example.com"}'`
4. Crear orden con API key y x-token:
   - `curl.exe -X POST http://localhost:8080/api/v1/orders -H "Content-Type: application/json" -H "x-api-key: DEMO_KEY" -H "x-token: secret" -d '{"items":[{"sku":"abc","qty":1}],"customerId":"1"}'`
5. Subir avatar con API key:
   - `curl.exe -X POST http://localhost:8080/api/v1/uploads/avatar -H "x-api-key: DEMO_KEY" -F "avatar=@docs/img_examples/example1.png"`
6. Stream SSE:
   - `curl.exe http://localhost:8080/api/stream`
   - Respuesta esperada: 5 lineas con `data: tick ...`

## v0.5
1. Subir avatar y guardar el storedName:
   - `curl.exe -X POST http://localhost:8080/api/v1/uploads/avatar -H "x-api-key: DEMO_KEY" -F "avatar=@docs/img_examples/example2.gif"`
2. Descarga usando storedName y guardar con nombre original:
   - `curl.exe -OJ -H "x-api-key: DEMO_KEY" http://localhost:8080/api/v1/uploads/files/<storedName>`
3. Persistencia de usuarios:
   - `curl.exe -X POST http://localhost:8080/api/v1/users -H "Content-Type: application/json" -H "x-api-key: DEMO_KEY" -d '{"name":"German","email":"german@example.com"}'`
   - Reinicia el servidor y luego:
   - `curl.exe http://localhost:8080/api/v1/users -H "x-api-key: DEMO_KEY"`
4. Persistencia de pagos idempotentes:
   - `curl.exe -X POST http://localhost:8080/api/v1/payments -H "Content-Type: application/json" -H "Idempotency-Key: pago-005" -H "x-api-key: DEMO_KEY" -d '{"amount":50}'`
   - Reinicia el servidor y repite el mismo request: debe responder igual.
