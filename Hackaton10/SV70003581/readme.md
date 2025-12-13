Vamos a crear una pagina web con el modulo http de NodeJs o express que permita cargar una lista de compras 

- Crear una ruta para crear la lista
- - Nombre, Descripcion, Fecha, EsCompletado 
- Crear una ruta para mostrar los pendientes
- Crear una ruta para mostrar los completados
- Crear una ruta para completar un item de la lista

    mkdir src src/config src/controllers src/models src/routes src/utils
    npm init -y
    touch readme.md .env src/seed.js src/server.js src/config/db.js src/config/sync-db.js src/utils/response.js
    echo -e "DB_NAME = \nDB_USER = \nDP_PASSWORD = \nDB_HOST = \nDB_PORT = \nDB_DIALECT = \nDB_SYNC = \n\n# force : Eliminar tablas y registros. Vuelve a definir las tablas desde cero.\n# alter: Actualiza la estructura de tablas sin eliminar datos.\n# none : Desactiva la sincronización (no toca la DB, solo la conecta)." > .env
    npm i bcryptjs cors dotenv express moment mongodb 
    npm i nodemon -D

Acceso: http://localhost:8080/