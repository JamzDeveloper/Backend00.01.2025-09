# Hackaton09 - v0.1 Inicio
Inicio del proyecto.

## Notas de versión
- Express con endpoint `/health`.
- Carga de variables con `dotenv`.
- Scripts `npm start` y `npm run dev` (con `nodemon`).

# Hackaton09 - v0.2 DB + Modelos
Etapa con Express, Sequelize y modelos definidos. Entidades y relaciones construidas.

## Notas de versión
- Endpoint `/health`.
- Config DB con Postgres o sqlite (según `DB_DIALECT`).
- Modelos: User, Course (con metadata JSONB/JSON), Lesson, Enrollment, Comment; relaciones y hooks básicos.
- Script `npm run db:sync` y sync opcional al levantar según `DB_SYNC` (`none|alter|force`).

# Hackaton09 - v0.3 CRUD API
Etapa con CRUD básico de usuarios, cursos y lecciones.

## Notas de versión
- CRUD sin autenticación:
  - `POST/GET /api/users`
  - `POST/GET/PUT/DELETE /api/courses`
  - `GET /api/courses/:id` (incluye lecciones)
  - `POST/GET/PUT/DELETE /api/courses/:courseId/lessons`

# Hackaton09 - v0.3.1 migraciones y seeds
Etapa con cambio de DBSync a migraciones e implementación de seeds.

## Notas de versión
- Añadida infraestructura de migraciones con sequelize-cli.
- Añadido el seeder de datos de prueba.
- Ajuste quitando columna innecesaria birthdate de User.
- Scripts npm actualizados.

# Hackaton09 - v0.4 autenticación
Etapa con autenticación.

## Notas de versión
- Autenticación JWT (`/api/auth/register`, `/api/auth/login`) y roles (admin/instructor/student).

# Hackaton09 - v0.5 API con roles, enrollments y comments
Etapa de implementación de roles, enrollments y comments.

## Notas de versión
- Cursos con filtros `q`, `published`, rangos `createdAt_gte/lte`, slug auto generado y cache simple; soft delete y restore.
- Lecciones con `order` incremental por curso, soft delete y restore.
- Enrollments: evita duplicados, cuenta alumnos, `PATCH /enrollments/:id/status` ajusta `studentsCount`.
- Comments con validación mínima en hook y autor tomado del token.

# Hackaton09 - v1.0.0-hackathon
Etapa final, API completa

## Notas de versión
- Arreglo para no mostrar el passwordhash en la lista en `POST /users`
- Arreglo de get lista de usuarios en un curso en `GET /courses/:slug`
- Documentación agregada.
