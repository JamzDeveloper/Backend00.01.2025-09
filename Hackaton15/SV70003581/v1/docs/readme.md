# Modo de Uso

### Comprobar conexión al servidor - (imagen 00)
    GET http://localhost:3000/api/v1/health

### Iniciar sesión - (imagen 01)
    POST http://localhost:3000/api/v1/session/login
    {
        "email":"admin@test.com",
        "password":"123456"
    }

### Verificar datos básicos de la sesión actual - (imagen 02)
    GET http://localhost:3000/api/v1/session/me

### Listar solo usuarios (rol) - (imagen 03)
    GET http://localhost:3000/api/v1/user/

### Obtener token (jwt) - (imagen 04)
    POST http://localhost:3000/api/v1/jwt/login
    
    {
        "email":"admin@test.com",
        "password":"123456"
    }
    
    Generará un Bearer Token y un refreshToken

### Listar solo administradores (rol) - (imagen 05)
    GET http://localhost:3000/api/v1/user/admin

    Bearer Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY4MTA2NDY4LCJleHAiOjE3NjgxMDcwNjh9.NeJhOUQh-JmeVWj7kuXMK3Frpp1R5HHw94T4shGL-Cw

### Refrescar Token - (imagen 06)
    POST http://localhost:3000/api/v1/jwt/refresh

    {
        "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY4MTA2NDY4LCJleHAiOjE3Njg3MTEyNjh9.UQQRO6j8OiyKFb3VaYOEcn5gGjFR6S5l2h_ggFAuCEI"
    }

### Cerrar sesión - (imagen 07)
    POST http://localhost:3000/api/v1/session/logout
