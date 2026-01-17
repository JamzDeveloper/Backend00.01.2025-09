# Hackaton15 - Autenticacion y sesiones (sv77217548)

API REST en TypeScript + Express + MongoDB para autenticacion basada en sesion y JWT.

## Requisitos
- Node 18+
- MongoDB local o Atlas

## Instalacion y ejecucion
```bash
cd Hackaton15/SV77217548
npm install
cp .env.example .env
npm run dev
```
La API levanta en `http://localhost:3000` por defecto.

## Variables de entorno
```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=session-secreto-cambiar
DATABASE_URL=mongodb://127.0.0.1:27017/sv77217548_h15
CORS_ORIGIN=http://localhost:3000
JWT_ACCESS_SECRET=access-secreto-cambiar
JWT_REFRESH_SECRET=refresh-secreto-cambiar
ACCESS_TTL=10m
REFRESH_TTL=7d
```

## Endpoints
- `POST /session/register` crear usuario (email, password, role opcional).
- `POST /session/login` iniciar sesion.
- `GET /csrf` obtener token CSRF para acciones de sesion.
- `POST /session/logout` cerrar sesion.
- `GET /me` datos de sesion actual.
- `GET /private/profile` ruta protegida.
- `POST /jwt/login` login con JWT (access en body, refresh en cookie).
- `POST /jwt/refresh` rota refresh token y entrega nuevo access.
- `POST /jwt/logout` revoca refresh token.
- `GET /jwt/me` datos del usuario autenticado con access token.
- `GET /admin/stats` ruta admin (permite sesion o JWT).

## Body de ejemplo (registro)
```json
{
  "email": "demo@correo.com",
  "password": "secret123",
  "role": "user"
}
```

## Notas
- La cookie de sesion se llama `sid`.
- La cookie de refresh token se llama `refreshToken`.
- Para `GET /jwt/me` usa header `Authorization: Bearer <accessToken>`.
- Para `GET /admin/stats` el usuario debe tener rol `admin`.
- Para `POST /session/logout` envia `X-CSRF-Token` obtenido desde `GET /csrf`.

## Seguridad
- Helmet habilitado para cabeceras basicas.
- Rate limit general (100 req/15 min) y mas estricto en login.
- CORS con credenciales y origenes desde `CORS_ORIGIN`.

## Tests
- Pruebas automatizadas con `npm test` (usa base `sv77217548_h15_test`).
- Ver pasos en `test/tests.md`.

## Swagger
- Genera el archivo con `npm run generate-swagger`.
- Levanta el server con `npm run dev`.
- Documentacion disponible en `http://localhost:3000/api-docs`.
- Para endpoints JWT usa el boton Authorize y pega `Bearer <accessToken>`.
- Para endpoints de sesion, primero haz login para que el navegador guarde la cookie.

## Archivos de soporte
- `updates.md` registro de versiones.
