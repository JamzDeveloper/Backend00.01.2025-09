# Hackaton09 API

Mini plataforma de cursos, lecciones, inscripciones y comentarios con Express + Sequelize.

## Requisitos
- Node 18+
- Postgres o SQLite

## Configuración `.env`
Ejemplo Postgres:
```env
PORT=3000
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=Hackaton09DB
DB_USERNAME=tu_username
DB_PASSWORD=tu_password
DB_LOGGING=false
JWT_SECRET=alguna_clave
COURSES_CACHE_TTL=30
```
Ejemplo SQLite:
```env
DB_DIALECT=sqlite
DB_STORAGE=./tests/tmp.sqlite
JWT_SECRET=alguna_clave_larga_y_unica
```

## Instalación y arranque

### Prueba con postgresql:
Primero tenemos que crear el rol para el DB en pgAdmin en un query:
```sql
CREATE ROLE user_example
  WITH LOGIN PASSWORD 'password_example'
       CREATEDB
       INHERIT;
```

y luego el DB:
```sql
CREATE DATABASE "Hackaton09DB" OWNER user_example;
```
Tenemos que configurar el .env con 
```env
DB_PORT=5432                # Puerto configurado de tu DB
DB_DATABASE=Hackaton09DB    # Nombre de tu base de datos
DB_USERNAME=user_example       # Username de la DB
DB_PASSWORD=password_example         # Password de la DB
DB_DIALECT=postgres         # postgres en este caso
DB_SYNC=alter               # tipo de sync
```

### Preuba con sqlite:
Si no tienes sqlite3 para probarlo, instálalo desde:
https://sqlite.org/download.html

Tenemos que configurar el `.env` con 
```env
DB_DIALECT=sqlite               # sqlite en este caso
DB_SYNC=alter                   # tipo de sync
DB_STORAGE=./tests/tmp.sqlite   # Ejemplo para crear el .sqlite en la carpeta /tests
```

```bash
npm install
npm run db:migrate   # crea tablas
npm run db:seed      # datos de prueba (admin/instructor/student, curso, lecciones)
npm run dev          # servidor en http://localhost:3000
```
Para limpiar datos de prueba: `npm run db:seed:undo`.  
Para revertir última migración (borra tablas): `npm run db:migrate:undo`.

## Usuarios prueba del seed
- admin@prueba.com / admin_password  (admin)
- instructor@example.com / instructor_password (instructor)
- rony.ng.2011@prueba.com / student_password (student)

## Endpoints clave
- Auth: `POST /api/auth/register`, `POST /api/auth/login` (JWT)
- Users: `POST/GET /api/users` (admin para crear, admin/instructor para listar, soporta `role`, `q`, paginación)
- Courses: `POST/GET/PUT/DELETE /api/courses`, `GET /api/courses/:slug`, `POST /api/courses/:id/restore`
- Lessons: `POST/GET/PUT/DELETE /api/courses/:courseId/lessons`, `POST /api/courses/:courseId/lessons/:id/restore`
- Enrollments: `POST /api/courses/:courseId/enrollments`, `PATCH /api/enrollments/:id/status`, `GET /api/courses/:courseId/enrollments`
- Comments: `POST/GET /api/lessons/:lessonId/comments`

Filtros soportados:
- Cursos: `q`, `published`, `order=createdAt:DESC|ASC`, `createdAt_gte/lte`
- Usuarios: `role`, `q`
- Enrollments: `status`
Todos los listados tienen paginación `page`/`pageSize`.

Roles:
- Crear/editar cursos y lecciones: admin o instructor.
- Inscribir y cambiar estado de inscripciones: admin o instructor.
- Crear comentario: cualquier rol autenticado; el autor se toma del token.

## Configuración de Postman
Configurar headers con:
- Content-Type: application/json
- Authorization: Bearer "TOKEN"
(reemplaza "TOKEN" con comillas incluidas, con el token generado al usuario correspondiente.)

## Documentación de pruebas
- `docs/requests.http`: colección con ejemplos listos (copialo en Postman).
- `docs/screenshots/`: colección de capturas de ejemplos en Postman.
- `docs/responses.md`: ejemplos de respuestas JSON.

## Changelog
Ver `CHANGELOG.md` para el historial de versiones.
