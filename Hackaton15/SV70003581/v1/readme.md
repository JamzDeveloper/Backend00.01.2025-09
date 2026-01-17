# Descripción
Sistema desarrollado en Express para autenticación y gestión de sesiones.
- Incluye login con sesión + cookies seguras y login con JWT (access y refresh tokens), protección de rutas, roles y permisos, y medidas de seguridad como HttpOnly, Secure, SameSite, CSRF, rate-limit, helmet y prevención de session fixation. Soporta logout seguro, rotación y revocación de tokens, y pruebas con Postman o supertest.
- Utiliza MongoDB/PostgreSQL o repositorio en memoria según configuración.

# Arquitectura de Capas

    config/ → configuración de entorno y sesión
    db/ → acceso a datos    
    middlewares/ → capa transversal (auth, roles, CSRF)
    routes/ → capa de entrada HTTP (endpoints)
    services/ → lógica de negocio (tokens, usuarios)
    utils/ → funciones auxiliares
    app.js / server.js → bootstrap de la aplicación

# Paquetes usados

## 📦 Paquetes principales (obligatorios para el proyecto)
    ✅express → Framework para crear el servidor y definir rutas HTTP.
    express-session → Manejo de sesiones en servidor con cookies y almacenamiento de sesión.
    cookie-parser → Lee y firma cookies enviadas por el cliente.
    ✅jsonwebtoken → Generación y verificación de tokens JWT (access y refresh).
    ✅dotenv → Carga variables desde .env a process.env.

## 🔐 Seguridad
    ✅helmet → Agrega cabeceras HTTP seguras contra ataques comunes.
    ✅express-rate-limit → Limita peticiones por IP para proteger rutas como /login.
    csurf → Protección contra ataques CSRF en flujos basados en sesión/formularios.
    ✅cors → Controla qué dominios pueden consumir tu API.

## 🔑 Contraseñas y hashing
    ✅bcryptjs → Hashear y validar contraseñas de usuario.

## 🗄️ Persistencia / base de datos (elige según tu DB)
    ✅mongoose → ODM para trabajar con MongoDB.
    pg → Cliente para PostgreSQL.
    prisma → ORM moderno para varias bases de datos (opcional).
    redis → Cliente Redis si usas store de sesión.
    connect-redis → Integración de Redis con express-session.

## 🧰 Utilidades útiles
    uuid → Generar identificadores únicos (por ejemplo, jti para tokens refresh).
    crypto (nativo, no npm) → Generar IDs aleatorios y secretos.
    ✅(-D) typescript → Tipado fuerte

## 🧪 Pruebas
    supertest → Hacer pruebas HTTP contra el servidor Express.
    jest o vitest → Framework de testing para JavaScript.
    newman → Ejecutar colecciones de Postman desde la terminal.

# Manejo de Errores
    console.log()	    → Mensaje informativo   | No detiene ejecución  | Debug normal
    console.error()	    → Mensaje de error      | No detiene ejecución  | Reportar error
    throw new Error()   → Excepción	            | Sí detiene ejecución  | Fallos críticos