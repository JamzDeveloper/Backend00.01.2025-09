# Ejemplos de respuestas

## Auth login (instructor)
```json
{
  "user": {
    "id": 2,
    "firstName": "Roberto",
    "lastName": "Pineda",
    "email": "instructor@example.com",
    "role": "instructor",
    "createdAt": "2025-11-30T02:30:00.000Z",
    "updatedAt": "2025-11-30T02:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Listar usuarios (filtro y paginación)
```json
{
  "total": 2,
  "page": 1,
  "pageSize": 10,
  "data": [
    { "id": 3, "firstName": "Rony", "lastName": "Chang", "email": "student@example.com", "role": "student" },
    { "id": 4, "firstName": "Olenka", "lastName": "Altamirano", "email": "student.2@example.com", "role": "student" }
  ]
}
```

## Listar cursos (filtros)
```json
{
  "total": 1,
  "page": 1,
  "pageSize": 5,
  "data": [
    {
      "id": 1,
      "title": "Curso Backend Avanzado",
      "slug": "curso-backend-avanzado",
      "published": true,
      "studentsCount": 2,
      "owner": { "id": 2, "firstName": "Roberto", "lastName": "Pineda", "email": "instructor@example.com" }
    }
  ]
}
```

## Detalle de curso por slug (incluye owner, lessons y stats)
```json
{
  "id": 1,
  "title": "Curso Backend Avanzado",
  "slug": "curso-backend-avanzado",
  "published": true,
  "description": "APIs con Express y Sequelize",
  "lessons": [
    { "id": 1, "title": "Leccion 1", "slug": "leccion-1", "order": 1 },
    { "id": 2, "title": "Leccion 2", "slug": "leccion-2", "order": 2 }
  ],
  "owner": { "id": 2, "firstName": "Roberto", "lastName": "Pineda", "email": "instructor@example.com" },
  "stats": {
    "lessonsCount": 2,
    "studentsCount": 2
  }
}
```

## Listar lecciones de un curso
```json
{
  "total": 2,
  "page": 1,
  "pageSize": 10,
  "data": [
    { "id": 1, "title": "Leccion 1", "slug": "leccion-1", "order": 1, "courseId": 1 },
    { "id": 2, "title": "Leccion 2", "slug": "leccion-2", "order": 2, "courseId": 1 }
  ]
}
```

## Listar enrollments de un curso
```json
{
  "total": 2,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": 4,
      "status": "active",
      "score": "12.00",
      "courseId": 1,
      "userId": 4,
      "student": { "id": 4, "firstName": "Olenka", "lastName": "Altamirano", "email": "student.2@example.com" }
    },
    {
      "id": 1,
      "status": "active",
      "score": "18.00",
      "courseId": 1,
      "userId": 3,
      "student": { "id": 3, "firstName": "Rony", "lastName": "Chang", "email": "student@example.com" }
    }
  ]
}
```

## Comentario creado
```json
{
  "id": 1,
  "body": "Comentario con al menos 5 caracteres",
  "lessonId": 1,
  "userId": 3,
  "createdAt": "2025-11-30T03:20:00.000Z",
  "updatedAt": "2025-11-30T03:20:00.000Z"
}
```
