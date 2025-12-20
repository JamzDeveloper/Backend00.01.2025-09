# API Produccion de Armarios (sv77217548)

Servicio REST con MongoDB y Mongoose para manejar inventario de materias primas, insumos, horas de personal y generar armarios con una receta fija.

Receta de produccion por armario:
- 1 tablon de materia prima
- 0.25 kg de goma
- 8 horas hombre

## Requisitos
- Node 18+
- MongoDB en `mongodb://127.0.0.1:27017/sv77217548` (puedes ajustar en `.env`)

## Instalacion y ejecucion
```bash
cd Hackaton11/SV77217548
npm install
cp .env.example .env           # ajusta MONGODB_URI/PORT si es necesario
npm run dev
```
La API levanta en `http://127.0.0.1:${PORT}` (por defecto 8080 si no defines PORT).

## Endpoints principales
- `GET /` ping.
- `POST /api/materials` crear materia prima.
- `POST /api/materials/:id/purchase` sumar stock de materia prima.
- `POST /api/supplies` crear insumo.
- `POST /api/supplies/:id/purchase` sumar stock de insumo.
- `POST /api/employees` crear empleado.
- `POST /api/employees/:id/register-hours` descontar horas disponibles.
- `POST /api/productions` generar armarios (descarga materia prima, insumo y horas).
- `GET /api/productions` listar lotes generados.
Todos los recursos incluyen `GET` para listar/detalle y `PATCH`/`DELETE` para actualizar o eliminar.

## Seed de datos
- Ejecuta `npm run seed` desde `Hackaton11/SV77217548` para cargar datos de ejemplo. Limpia las colecciones de materiales, insumos y empleados e inserta registros nuevos.
- Se imprime los IDs creados; úsalos en `docs/requests.http` en las variables `materialId`, `supplyId`, `employeeId`.

