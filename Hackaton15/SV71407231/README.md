# Hackaton 15 

## Tecnologías
- Node.js
- Express
- JWT
- express-session
- bcrypt
- cookie-parser

## Instalación
npm install

## Variables de entorno
Ver archivo `.env.example`

## Ejecución
npm run dev

## Endpoints 

#### Autenticación por sesión
GET /csrf-token
POST /session/login
POST /session/logout
GET /session/me

#### Autenticación por JWT
POST /jwt/login
POST /jwt/refresh
POST /jwt/logout
GET /jwt/me

#### Rutas protegidas
GET /admin/stats

#### Rutas de prueba
GET /session-test

## Seguridad
- JWT Access + Refresh
- Cookies HttpOnly
- Rate limit en login
- Sesiones configuradas

## Pruebas
Probado con Postman
