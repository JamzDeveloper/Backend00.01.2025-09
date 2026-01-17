# Updates

## v1.0
- Respuesta del asistente se regenera al editar mensajes con contexto hasta ese mensaje.
- Eliminacion individual de mensajes y respuesta asociada.
- Indicador de asistente escribiendo.
- Logout automatico al expirar el token.

## v0.2
- Registro e inicio de sesion con JWT.
- Socket.io protegido por token y mensajes ligados al usuario autenticado.
- Historial y mensajes filtrados por usuario.
- UI con pantalla de acceso y boton para cerrar sesion.

## v0.1
- Servidor base con Express, HTTP y Socket.io.
- Persistencia en MongoDB (db `sv77217548_h14`) con coleccion `messages`.
- UI web con historial, envio en tiempo real, editar mensajes y borrar historial.
- Integracion ChatGPT via OpenAI.
