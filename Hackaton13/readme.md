
# 🚀 Hackatón Express Pro — 6 Horas

![Logo](https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png)

## 🕒 Horario General
| Fase | Tema | Duración | Hora sugerida |
|------|-------|-----------|----------------|
| 1 | Estructura + Middlewares | 2h | 09:00 - 11:00 |
| 2 | Rutas, Router y Validaciones | 2h | 11:00 - 13:00 |
| 🧃 Break | Almuerzo / descanso | 1h | 13:00 - 14:00 |
| 3 | Uploads + Idempotencia + Métricas | 2h | 14:00 - 16:00 |

---

## 🎯 Objetivo General
Desarrollar una **API modular con Express.js** que implemente:

- Middlewares personalizados y manejo de errores avanzado.  
- Rutas versionadas con Express Router.  
- Subida y descarga de archivos.  
- Endpoints idempotentes, métricas y validaciones.  
- Documentación profesional con Swagger. (Opcional)

---

## 🧩 Fase 1 — *Estructura y Middlewares* (09:00–11:00)

### Objetivos
1. Crear estructura base (`src/app.js`, `server.js`, `routes/`, `middlewares/`).
2. Implementar middlewares personalizados y globales.

### Requerimientos
- Middleware `logger` que muestre método, ruta y duración.
- Middleware `requireJson` que bloquee peticiones sin `Content-Type: application/json`.
- Middleware `errorHandler` global con manejo de errores async.
- Integrar `helmet`, `cors`, `compression`, `morgan` y `express-rate-limit`.

### Endpoints esperados
- `GET /api/health` → `{ status: 'ok' }`
- `POST /api/data` → `{ received: true }`

---

## 🧭 Fase 2 — *Rutas y Validaciones* (11:00–13:00)

### Objetivos
1. Implementar rutas versionadas con `Express.Router()`.
2. Crear endpoints con params, query y validación.
3. Proteger rutas con headers personalizados.

### Requerimientos
- `/api/v1/users`  
  - `GET /` → lista usuarios  
  - `POST /` → valida `{ name, email }`  
  - `GET /:id` → retorna usuario  
- `/api/v1/orders`  
  - Protegido con `x-token: secret`  
  - `GET /` → paginación, filtro y orden  
  - `POST /` → valida `{ items, customerId }`  
    - `GET /export` → CSV streaming

  ---

  ## 🗂️ Fase 3 — *Uploads, Idempotencia y Métricas* (14:00–16:00)

### Objetivos
1. Implementar `multer` para subida de archivos.  
2. Crear endpoint idempotente con `Idempotency-Key`.  
3. Agregar métricas y documentación Swagger.

### Requerimientos
- `/api/v1/uploads/avatar`: recibe imagen (máx. 2MB, solo `image/*`).
- `/api/v1/payments`: requiere `Idempotency-Key`, misma respuesta si se repite.
  - `/api/metrics`: muestra métricas de rutas.  
  - `/api/docs`: documentación Swagger.

---                                                         m

## 💡 Desafío Bonus
- Autenticación con API Key (`x-api-key`).
- Middleware condicional para loguear solo `POST` y `PUT`.
- Endpoint SSE `/api/stream` que emita 5 ticks (cada segundo).

---

## 🧮 Criterios de Evaluación

| Criterio | Peso | Descripción |
|-----------|------|-------------|
| Funcionalidad completa | 40% | Cumple todos los endpoints. |
| Estructura y modularidad | 25% | Código limpio, routers bien separados. |
| Manejo de errores y seguridad | 15% | Validaciones, idempotencia, headers. |
| Documentación Swagger | 10% | Navegable y actualizada. |
| Originalidad / Bonus | 10% | Extras, mejoras o estilo propio. |

---

## ⚙️ Entregables
- Carpeta del proyecto (`src/`, `routes/`, `middlewares/`).  
- `README.md` explicando endpoints.  
- `docs/openapi.yaml` con documentación Swagger.  
- Comando de ejecución:
  ```bash
  npm install
  npm run dev
  ```
- (Opcional) Colección Postman o Insomnia.

---

## 🏆 Resultado Esperado
Una **API Express avanzada** con:
- Middlewares personalizados.
- Rutas modulares y versionadas.
- Validaciones robustas.
- Uploads, métricas, Swagger y flujo idempotente.

> 💬 **Duración total:** 6 horas  
> **Dificultad:** Media - Alta  
> **Requisitos previos:** Node.js, JavaScript intermedio, fundamentos REST.
