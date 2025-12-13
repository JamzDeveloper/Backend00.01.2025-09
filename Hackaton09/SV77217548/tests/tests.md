# Cómo probar

## Prueba con postgre:
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
DB_PORT=5432                  # Puerto configurado de tu DB
DB_DATABASE=Hackaton09DB      # Nombre de tu base de datos
DB_USERNAME=user_example      # Username de la DB
DB_PASSWORD=password_example  # Password de la DB
DB_DIALECT=postgres           # postgres en este caso
DB_SYNC=alter                 # tipo de sync
```

Luego vamos a ejecutar los comandos:
```bash
npm install
npm run dev         # o npm start
# Opcional por si quieres sincronizar de manera manual.
npm run db:sync
```

Para probar que las tablas se hayan creado correctamente, puedes verificar en pgAdmin si lo tienes instalado y configurado para postgres en tu `.env`.


# Preuba con sqlite:
Si no tienes sqlite3 para probarlo, instálalo desde:
https://sqlite.org/download.html

Tenemos que configurar el `.env` con 
```env
DB_DIALECT=sqlite               # sqlite en este caso
DB_SYNC=alter                   # tipo de sync
DB_STORAGE=./tests/tmp.sqlite   # Ejemplo para crear el .sqlite en la carpeta /tests
```

Luego vamos a ejecutar los comandos:
```bash
npm install
npm run dev         # o npm start
# Opcional por si quieres sincronizar de manera manual.
npm run db:sync
```

Verás cómo se creó el archivo `.sqlite` donde lo pusiste y lo puedes visualizar si por ejemplo lo llamaste tmp.sqlite en la carpeta `/tests`:
```bash
sqlite3 ./tests/tmp.sqlite ".tables"                    # Visualizamos las tablas existentes
sqlite3 ./tests/tmp.sqlite "PRAGMA table_info(users);"  # Muestra el esquema de la tabla users
```

## Prueba del Health
Ahora en otra terminal prueba, para verificar que el health funciona mientras está ejecutando `server.js`:
```bash
curl http://localhost:3000/health
```
Deberías recibir:
```json
{ "ok": true, "timestamp": "..." }
```

## Pruebas con migraciones y seeds (v0.3.1)
```bash
# 1) Aplica migraciones para ajustar tablas y relaciones con la base limpia sin data.
npm run db:migrate

# 2) Carga datos de prueba (admin/instructor/student, curso, lecciones)
npm run db:seed

# 3) Levanta el servidor
npm run dev

# 4) Endpoints de prueba
curl http://localhost:3000/api/users
curl http://localhost:3000/api/courses
curl http://localhost:3000/api/courses/1/lessons
```
Para limpiar los datos de prueba sin tocar el resto:
```bash
npm run db:seed:undo      # borra solo los datos insertados por el seeder.
npm run db:migrate:undo   # revierte la última migración si es neccesario.
```

## Pruebas API REST (v0.3 sin auth)
Ejecuta el servidor (`npm run dev`) y prueba con `curl` en otra terminal:

```bash
# 1) Crear usuario (role por defecto student)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Rony","lastName":"Chang","email":"student@example.com","password":"student_password"}'

# 2) Listar usuarios (paginado y filtro por role)
curl "http://localhost:3000/api/users?page=1&pageSize=5&role=student"

# 3) Crear curso (usa ownerId de un usuario existente)
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso Backend","description":"Intro a APIs","ownerId":1,"published":false,"metadata":{"level":"intro"}}'

# 4) Listar cursos con filtros/orden
curl "http://localhost:3000/api/courses?published=false&q=node&order=createdAt:DESC&page=1&pageSize=5"

# 5) Crear leccion en un curso (usa courseId del curso creado)
curl -X POST http://localhost:3000/api/courses/1/lessons \
  -H "Content-Type: application/json" \
  -d '{"title":"Leccion 1","body":"Contenido minimo de prueba"}'

# 6) Listar lecciones de un curso (ordenadas por order)
curl "http://localhost:3000/api/courses/1/lessons?page=1&pageSize=10"
```

Si quieres probar con sqlite, recuerda dejar `DB_DIALECT=sqlite` y `DB_STORAGE=./tests/tmp.sqlite` en `.env`, sincronizar (`npm run db:sync`) y luego correr los mismos curls.

### Casos de error para validar manejo de errores
```bash
# Email duplicado (409)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Rony","lastName":"Chang","email":"student@example.com","password":"student_password"}'
# repite el mismo curl y espera 409

# Campos obligatorios faltantes (400)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Rony"}'

# metadata no es objeto (400)
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso Backend","description":"Intro a APIs","ownerId":1,"metadata":"no es un objeto"}'

# Curso inexistente al crear leccion (404)
curl -X POST http://localhost:3000/api/courses/999/lessons \
  -H "Content-Type: application/json" \
  -d '{"title":"Leccion 3","body":"Contenido minimo de prueba"}'

# Recurso inexistente (404)
curl http://localhost:3000/api/courses/99999
```

## Prueba v0.4 con auth y roles
```bash
# 1) Migraciones + seed de prueba
npm run db:migrate
npm run db:seed
npm run dev

# 2) Login como instructor
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"instructor@example.com","password":"instructor_password"}'

# 3) Guarda el token en una variable para que no estes copiando y pegando varias veces
TOKEN=...aqui va el token...

# 4) Crear curso (debe funcionar con token de instructor)
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso Nuevo","description":"Desc","ownerId":2,"published":false}'

curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Brando","lastName":"Lopez","email":"student.2@example.com","password":"student_password"}'

# 5) Login como student
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"student_password"}'

# 6) Guarda el token en una variable para que no estes copiando y pegando varias veces
TOKEN_STUDENT=...aqui va el token...

# 7) Intentar crear curso con student (debe devolver 403)
curl -i -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer $TOKEN_STUDENT" \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso Nuevo 2","description":"Desc","ownerId":3,"published":false}'
```
Requisitos: `JWT_SECRET` configurado en `.env`

## Prueba v0.4/v0.5 con auth, roles y extras
```bash
# 1)  Migraciones + seed de prueba
npm run db:migrate
npm run db:seed
npm run dev

# 2) Login como instructor
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"instructor@example.com","password":"instructor_password"}'

# 3) Guarda el token en una variable para que no estes copiando y pegando varias veces
TOKEN=...copia y pega aqui va el token...

# 4) Crear curso (debe funcionar con token de instructor)
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso Nuevo","description":"Desc","ownerId":2,"published":true}'

# 5) Login como student
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"student_password"}'

# 6) Guarda el token en una variable para que no estes copiando y pegando varias veces
TOKEN_STUDENT=...copia y pega aqui va el token...

# 7) Intentar crear curso con student (debe devolver 403)
curl -i -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer $TOKEN_STUDENT" \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso Nuevo 2","description":"Desc","ownerId":3,"published":false}'

# 8) Inscribir (transacción: crea, activa, incrementa studentsCount)
curl -X POST http://localhost:3000/api/courses/1/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":3}'

# 9) Cambiar estado/score de inscripción
curl -X PATCH http://localhost:3000/api/enrollments/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","score":18}'

# 10) Comentarios (student puede comentar)
curl -X POST http://localhost:3000/api/lessons/1/comments \
  -H "Authorization: Bearer $TOKEN_STUDENT" \
  -H "Content-Type: application/json" \
  -d '{"userId":3,"body":"Excelente curso"}'

# 11) Restaurar curso/lección (solo admin/instructor)
curl -X POST http://localhost:3000/api/courses/1/restore -H "Authorization: Bearer $TOKEN"
curl -X POST http://localhost:3000/api/courses/1/lessons/1/restore -H "Authorization: Bearer $TOKEN"
```
Requisitos: `JWT_SECRET` y `COURSES_CACHE_TTL` configurado en `.env` .