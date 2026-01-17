# Tests

Coleccion Postman: `test/postman_collection.md`.

## v0.1
1. Instalar dependencias:
   - `npm install`
2. Configurar entorno:
   - Copiar `.env.example` a `.env`.
   - Ajustar `DATABASE_URL` si se usa otra base.
3. Iniciar servidor:
   - `npm run dev`
4. Registrar usuario:
   - `curl.exe -X POST http://localhost:3000/session/register -H "Content-Type: application/json" -d "{\"email\":\"demo@correo.com\",\"password\":\"secret123\",\"role\":\"user\"}"`
5. Login y guardar cookie:
   - `curl.exe -c cookies.txt -X POST http://localhost:3000/session/login -H "Content-Type: application/json" -d "{\"email\":\"demo@correo.com\",\"password\":\"secret123\"}"`
6. Obtener CSRF token:
   - `curl.exe -b cookies.txt -c cookies.txt http://localhost:3000/csrf`
   - Copia `csrfToken` de la respuesta.
7. Ver sesion activa:
   - `curl.exe -b cookies.txt http://localhost:3000/me`
8. Acceder a ruta privada:
   - `curl.exe -b cookies.txt http://localhost:3000/private/profile`
9. Logout (con CSRF):
   - `curl.exe -b cookies.txt -X POST http://localhost:3000/session/logout -H "X-CSRF-Token: <csrfToken>"`
10. Verificar sesion cerrada:
   - `curl.exe -b cookies.txt http://localhost:3000/me`

## v0.2
1. Compilar a JS:
   - `npm run build`
2. Levantar desde dist:
   - `node dist/server.js`
   - Detenlo con Ctrl+C al terminar.
3. Login JWT y guardar refresh token:
   - `curl.exe -c cookies.txt -X POST http://localhost:3000/jwt/login -H "Content-Type: application/json" -d "{\"email\":\"demo@correo.com\",\"password\":\"secret123\"}"`
4. Acceder a /jwt/me con access token:
   - Copia el `accessToken` de la respuesta anterior.
   - `curl.exe http://localhost:3000/jwt/me -H "Authorization: Bearer <accessToken>"`
5. Refresh de access token:
   - `curl.exe -b cookies.txt -X POST http://localhost:3000/jwt/refresh`
6. Logout JWT:
   - `curl.exe -b cookies.txt -X POST http://localhost:3000/jwt/logout`

## v0.3
1. Generar Swagger:
   - `npm run generate-swagger`
2. Levantar el servidor:
   - `npm run dev`
3. Abrir Swagger UI:
   - `http://localhost:3000/api-docs`
4. Probar JWT en Swagger:
   - Ejecuta `POST /jwt/login` y copia el `accessToken`.
   - Click en Authorize y pega `Bearer <accessToken>`.
   - Ejecuta `GET /jwt/me`.
5. Registrar admin:
   - `curl.exe -X POST http://localhost:3000/session/register -H "Content-Type: application/json" -d "{\"email\":\"admin@correo.com\",\"password\":\"secret123\",\"role\":\"admin\"}"`
6. Login admin por sesion:
   - `curl.exe -c cookies.txt -X POST http://localhost:3000/session/login -H "Content-Type: application/json" -d "{\"email\":\"admin@correo.com\",\"password\":\"secret123\"}"`
7. Acceder a admin con sesion:
   - `curl.exe -b cookies.txt http://localhost:3000/admin/stats`
8. Login admin por JWT:
   - `curl.exe -X POST http://localhost:3000/jwt/login -H "Content-Type: application/json" -d "{\"email\":\"admin@correo.com\",\"password\":\"secret123\"}"`
9. Acceder a admin con JWT:
   - Copia el `accessToken` de la respuesta anterior.
   - `curl.exe http://localhost:3000/admin/stats -H "Authorization: Bearer <accessToken>"`
10. Validar bloqueo sin rol:
   - Registra un usuario normal y repite el paso 3 o 5.
   - Esperado: 403 "No tienes permisos".

## v0.4
1. Probar CSRF en logout:
   - Ejecuta `GET /csrf` y copia `csrfToken`.
   - Ejecuta `POST /session/logout` con header `X-CSRF-Token`.
2. Probar rate limit:
   - Ejecuta varias veces `POST /session/login` (mas de 20 en 15 min).
   - Esperado: 429 "Too Many Requests".

## v1.0.0
1. Asegura que MongoDB este corriendo.
2. El runner usa `mongodb://127.0.0.1:27017/sv77217548_h15_test` si no existe `TEST_DATABASE_URL`.
3. Ejecuta pruebas automatizadas:
   - `npm test`
