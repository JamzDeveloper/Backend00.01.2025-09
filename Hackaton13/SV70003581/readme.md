## Comandos de ejecución:

    npm install

    npm run start

## Colección POSTMAN

    En la carpeta /docs

    Solo para POST, api-token = 123123

## Paquetes usados
### bcryptjs
Se usa para hashear contraseñas antes de guardarlas en la base de datos, evitando almacenar contraseñas en texto plano.
### cors
Permite que el navegador acceda a tu API desde otros dominios (por ejemplo, un frontend en React consumiendo tu backend).
### dotenv
Sirve para manejar variables de entorno desde un archivo .env (puertos, credenciales, claves secretas).
### express
Framework para crear el servidor, manejar rutas, middlewares y peticiones HTTP.
### express-validator
Middleware para validar y sanitizar datos que llegan en las requests (campos obligatorios, formato de email, etc.).
### mongoose
ODM (no ORM estrictamente) para modelar datos y trabajar con MongoDB usando esquemas y modelos.
### multer
Middleware para manejar subida de archivos (imágenes, PDFs, etc.), permitiendo definir límites de tamaño y cantidad.
### helmet
Agrega headers HTTP de seguridad a la aplicación para protegerla contra ataques comunes como XSS, clickjacking y sniffing de contenido.
### compression
Middleware que comprime las respuestas HTTP (gzip / brotli), reduciendo el tamaño de los datos enviados y mejorando el rendimiento de la API.
### morgan
Middleware de logging que registra en consola o archivos cada petición HTTP (método, ruta, estado, tiempo de respuesta), útil para debugging y monitoreo.
### express-rate-limit
Middleware que limita la cantidad de peticiones por IP en un periodo de tiempo, ayudando a prevenir abusos, ataques de fuerza bruta y DoS simples.