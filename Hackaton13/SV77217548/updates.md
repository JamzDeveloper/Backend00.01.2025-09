# Updates

## v0.1
- Express app base y punto de entrada del servidor.
- Middlewares: logger (method/route/duration), requireJson, error handler, async wrapper.
- Rutas: `GET /api/health`, `POST /api/data`.

## v0.2
- Router versionado con `/api/v1`.
- Usuarios: listado, creación con validación y detalle por id.
- Ordenes: rutas protegidas por header `x-token`, creación con validación y listado con paginación/filtros.
- Exportación CSV por streaming en `GET /api/v1/orders/export`.

## v0.3
- Uploads con `multer` en `POST /api/v1/uploads/avatar` (solo imagen, 2MB máximo).
- Descarga de archivos en `GET /api/v1/uploads/files/:filename`.
- Idempotencia para pagos en `POST /api/v1/payments` con `Idempotency-Key`.
- Metricas de rutas en `GET /api/metrics`.

## v0.4
- Autenticación por API key en `/api/v1` con header `x-api-key`.
- SSE en `GET /api/stream` con 5 ticks (1s).
- Logger condicional para POST y PUT.

## v0.5
- Persistencia en `data/*.json` para usuarios, ordenes y pagos.
- Uploads guardan metadata y descargan con nombre original.
