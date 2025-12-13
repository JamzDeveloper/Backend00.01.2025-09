# Instalar dependencias
    npm i express sequelize pg pg-hstore dotenv
    npm install bcryptjs

# Comandos usados
    npm run seed -> Para generar registros
    npm run dev -> Para ejecutar el servidor

---
---
---

# Endpoints

Ver todos los Users

    http://localhost:3000/users/

Ver User por Id

    http://localhost:3000/users/1 (donde 1 es idUser)

Buscar Users con parámetro q (que busca coincidencias en firstName, lastName y email)

    http://localhost:3000/users?q=jo

Agregar User

    http://localhost:3000/users/
    {
        "firstName": "Luca",
        "lastName": "Moretz",
        "email": "lolo.17@gmail.com",
        "password": "gatituz"
    }

Actualizar User

    http://localhost:3000/users/4
    {
        "firstName": "Mario",
        "lastName": "Moreno",
        "email": "lolo.17@gmail.com",
        "password": "naditas"
    }

Eliminar User

    http://localhost:3000/users/4

---
---
---

Ver Course por slug

    http://localhost:3000/courses/:slug

    - Path Variables:
    key: slug   Value: introduccion-a-nodejs

Agregar Course

    http://localhost:3000/courses
    {
        "title": "Backend con Python",
        "description": "Aprendiendo FastAPI",
        "published":true, (OPCIONAL)
        "ownerId": 2
    }

Actualizar Course

    http://localhost:3000/courses/1 (donde 1 es id)
    {
        "title": "Backend con Python",
        "description": "Aprendiendo FastAPI",
        "ownerId": 2 
    }

Eliminar Course

    http://localhost:3000/courses/1 (donde 1 es id)

---
---
---

Agregar una Lesson

    http://localhost:3000/lessons/
    {
        "title":"leccion nueva",
        "body":"sin tilde por precaucion",
        "order":"1",
        "courseId":"3"
    }

Ver todas las lecciones

    http://localhost:3000/lessons/

Buscar Lecciones con parámetro q 

    http://localhost:3000/lessons/?q=SQ

Buscar Leccion por Id

    http://localhost:3000/lessons/1 (donde 1 es id)

Actualizar una Lesson

    http://localhost:3000/lessons/1 (donde 1 es id)
    {
        "title":"leccion de MSSQL",
        "body":"sin tilde por precaucion",
        "order":"1",
        "courseId":"3"
    }

Eliminar Lesson

    http://localhost:3000/lessons/1(donde 1 es id)

---
---
---

Crear Enrollment

    http://localhost:3000/enrollments/
    {
        "userId":"3",
        "courseId":"2"
    }

Ver todos los Enrollments

    http://localhost:3000/enrollments/

Buscar Enrollments por userId y/o courseId

    http://localhost:3000/enrollments?userId=1&courseId=2
    http://localhost:3000/enrollments?userId=1
    http://localhost:3000/enrollments?courseId=2

Actualizar Enrollment (Patch): Se pueden actualizar 1 o más campos

    http://localhost:3000/enrollments/2/status
    {
    "status": "active",
    "score": 95
    }

Eliminar Enrollment

    http://localhost:3000/enrollments/3

---
---
---

Crear Comment

    http://localhost:3000/comments/
    {
        "body":"este es mi primer comentario",
        "userId":3,
        "lessonId":2
    }

Ver todos los Comments

    http://localhost:3000/comments/

Buscar Enrollments por userID y/o lessonId

    http://localhost:3000/comments?userId=1
    http://localhost:3000/comments?lessonId=2

Ver Comments definiendo propiedades de página

    http://localhost:3000/comments?page=1&pageSize=2

Buscar Comment por Id

    http://localhost:3000/comments/1 (donde 1 es id)

Actualizar Comment
    
    http://localhost:3000/comments/1 (donde 1 es id)
    {
        "body":"Masomenos la clase",
        "userId":3,
        "lessonId":2
    }

Eliminar Enrollment

    http://localhost:3000/comments/1 (donde 1 es id)