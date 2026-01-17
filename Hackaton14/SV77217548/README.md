# Hackaton14 - Chat persistente con MongoDB y ChatGPT

## Requisitos
- Node.js 18+
- MongoDB local o Atlas
- API Key de OpenAI

## Configuracion
1. Copia `.env.example` a `.env`.
2. Ajusta las variables:
   - `MONGOURI`
   - `DB_NAME` (usa `sv77217548_h14`)
   - `MESSAGES_COLLECTION` (opcional)
   - `USERS_COLLECTION` (opcional)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `BCRYPT_SALT_ROUNDS` (opcional)
   - `openAIKey`
   - `openAIModel`
   - `HISTORY_LIMIT` y `CONTEXT_LIMIT`
   - `SYSTEM_PROMPT`

## Scripts
- `npm install`
- `npm run dev`
- `npm start`

## Auth API
- `POST /api/auth/register` `{ "username": "...", "password": "..." }`
- `POST /api/auth/login` `{ "username": "...", "password": "..." }`

## Uso
- Abre `http://localhost:8080`.
- Registra o inicia sesion con usuario y contrasena.
- Envia mensajes para verlos en tiempo real.
- Usa **Editar** para cambiar un mensaje enviado.
- Usa **Eliminar** para borrar un mensaje puntual.
- La respuesta del asistente se regenera cuando editas un mensaje.
- Usa **Borrar historial** para limpiar la conversacion.
- Health check: `GET /health`.

## Notas
- Los mensajes se guardan en la coleccion `messages` dentro de `sv77217548_h14`.
- El historial y los mensajes en tiempo real se filtran por usuario.
- Los usuarios se guardan con contraseña encriptada (bcrypt) y autenticacion JWT.
- La sesion se cierra automaticamente cuando el token expira.
- Si `openAIKey` no esta configurada, el chat funciona sin respuesta del bot.