# Hackatón: API de Gestión de Ventas (Node.js + HTTP nativo)

## Objetivo general
Construir una **API REST simple** usando **Node.js sin frameworks** (`node:http`) para administrar una lista de ventas/tareas (`listSales`) en memoria, permitiendo:

- Listar todos los registros
- Filtrar por **pendientes** y **completados**
- Crear nuevos registros vía **POST**
- Manejar errores y endpoints inexistentes

---

## Contexto del reto
La empresa necesita un microservicio liviano para registrar “ventas/tareas” con estos campos:

- `name` (string) — nombre de la venta/tarea
- `description` (string) — descripción
- `date` (string o ISO) — fecha
- `esCompletado` (boolean) — estado

La API debe responder en **JSON** y seguir buenas prácticas mínimas (status codes, headers, validaciones, etc.).

---

## Reglas y restricciones
- ✅ Solo se permite `node:http` (sin Express/Fastify).
- ✅ Datos en memoria (arreglo `listSales`).
- ✅ Respuestas con `Content-Type: application/json`.
- ✅ Manejo de rutas con `method` y `url`.
- ❌ No usar base de datos (opcional como “bonus” al final).
- ✅ Se debe probar con Postman/Insomnia/curl.

---

## Endpoints requeridos (mínimo viable)

### 1) GET `/api/lista`
Devuelve el arreglo completo.

**Respuesta esperada (200):**
```json
[]
```

---

### 2) GET `/api/lista/pendientes`
Devuelve solo los items donde `esCompletado === false`.

**Respuesta esperada (200):**
```json
[
  {
    "name": "Venta A",
    "description": "Cliente X",
    "date": "2025-12-17",
    "esCompletado": false
  }
]
```

---

### 3) GET `/api/lista/completados`
Devuelve solo los items donde `esCompletado === true`.

---

### 4) POST `/api/lista`
Crea un nuevo registro.

**Body ejemplo:**
```json
{
  "name": "Venta B",
  "description": "Cliente Y",
  "date": "2025-12-17",
  "esCompletado": true
}
```

**Respuesta esperada (201):**
- Debe devolver la lista actualizada o el item creado (elige una estrategia y sé consistente).

---

## Validaciones obligatorias
En el POST:

- Si falta `name`, `description`, `date` o `esCompletado` → **400 Bad Request**
- Mensaje ejemplo:
```json
{ "message": "faltan campos" }
```

> ⚠️ Importante: `false` es un valor válido.  
> No valides `esCompletado` con `!esCompletado` porque `false` fallaría.  
> Valida así: `typeof esCompletado !== "boolean"`.

---

## Manejo de errores
Para rutas no existentes:
- Responder con **404** (recomendado) o el código que definan, pero consistente.
- JSON:
```json
{ "message": "endpoint not found" }
```

---

## Entregables
1) Repositorio o carpeta con:
- `server.js` o `index.js`
- Instrucciones en `README.md` para ejecutar y probar

2) Evidencia de pruebas:
- Capturas o colección de Postman (opcional pero recomendado)

---

## Checklist de evaluación (puntaje sugerido)
- ✅ Rutas GET funcionan (lista, pendientes, completados)
- ✅ POST crea correctamente
- ✅ Validaciones correctas (incluye boolean bien validado)
- ✅ Status codes correctos (200/201/400/404)
- ✅ JSON y headers correctos (Content-Type)
- ✅ Código legible y ordenado

---

## Bonus (para puntos extra)
- Agregar `id` autogenerado (`crypto.randomUUID()` o contador incremental)
- Agregar endpoint PUT `/api/lista/:id` para actualizar `esCompletado`
- Agregar endpoint DELETE `/api/lista/:id`
- Persistencia en archivo JSON (fs) en vez de solo memoria
- Soportar query params (ej: `/api/lista?status=pendiente`)

---

## Pistas basadas en el código fuente (bugs típicos a corregir)
Durante la hackatón se espera que el equipo identifique y corrija detalles comunes:

- La ruta del POST debe ser `'/api/lista'` (ojo con el slash inicial).
- Se está intentando hacer `listSales.push(data)` pero `data` no existe: se debe construir el objeto a insertar.
- `Content-Type` tiene un typo: `"apllication/json"`.
- La validación de `esCompletado` debe aceptar `false` como válido.
