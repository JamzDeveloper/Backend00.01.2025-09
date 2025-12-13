# Mini-Learning Platform API
API REST construida con **Node.js, Express y Sequelize** para gestionar usuarios, cursos, lecciones, enrollments y comentarios.

## 1. Requisitos
- Node.js ≥ 18  
- Docker y Docker Compose (opcional si quieres levantar Postgres en contenedor)
- npm ≥ 9 

## 2. Instalación

```bash
git clone <https://github.com/Harold-11/Backend00.01.2025-09.git>
cd <Hackaton09/SV71407231>
npm install
```

## Crear archivo .env

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASS=
DB_SYNC=
PORT=

## 3. Levantar con Docker

docker-compose up -d

## 4. Iniciar la API (modo desarrollo):

npm run dev