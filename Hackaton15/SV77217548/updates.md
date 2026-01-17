# Updates

## v1.0.0
- Pruebas automatizadas con node:test y supertest.
- Script `npm test` que compila y ejecuta pruebas.
- Archivo `test/auth.test.js` con flujos de sesion, JWT y rol admin.

## v0.4
- Helmet, CORS y rate limit para endurecer seguridad.
- CSRF en logout de sesion con endpoint `GET /csrf`.

## v0.3
- Documentacion Swagger con swagger-autogen y Swagger UI.
- Script `generate-swagger` y endpoint `/api-docs`.
- Esquemas de seguridad para bearer y cookies en Swagger.
- Middleware de roles y ruta admin protegida.

## v0.2
- Login JWT con access token y refresh token en cookie.
- Rotacion y revocacion de refresh tokens en MongoDB.
- Middleware para proteger rutas con access token.

## v0.1
- Base TypeScript + Express.
- Conexion a MongoDB con Mongoose.
- Registro y login por sesion con cookies.
- Logout y endpoint `GET /me`.
- Ruta privada protegida con middleware de sesion.
