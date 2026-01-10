# Hackatón (6 horas) — Autenticación y Sesiones en Express
**Semana 14 — Nivel medio/avanzado**  
**Tema:** Cookies, sesiones en Express, login con sesión o token (JWT)

---

## Objetivos de aprendizaje
1. Implementar autenticación basada en **sesión** usando `express-session` y cookies seguras.
2. Implementar autenticación basada en **token** usando **JWT** (access + refresh).
3. Proteger rutas con **middlewares**, **roles** y **scopes**.
4. Endurecer la seguridad: **HttpOnly**, **Secure**, **SameSite**, **CSRF**, **rate‑limit**, **helmet**, **session fixation**.
5. Diseñar un **logout** correcto (revocación de tokens, rotación de refresh, invalidación de sesión).
6. Medir con pruebas automatizadas (Postman/newman o `supertest`) y checklist OWASP.

---

## Reglas y formato
- Trabajo individual o en parejas.
- Puedes usar cualquier DB (recomendado: **MongoDB** o **PostgreSQL**). Si no hay DB, usa un **repositorio en memoria** + **dotenv**.
- Debes entregar al final:
  - Repositorio con código.
  - Archivo `README.md` con instrucciones de ejecución y **colección Postman** (o tests `supertest`).
  - Captura de pantalla de pruebas pasando (o reporte `newman`).
- Restricciones: no usar frameworks de auth “plug‑and‑play” (Auth0, Passport con estrategias prearmadas está ok si las configuras tú, pero **debes** mostrar cómo funciona la sesión/JWT “a mano”).

---

## Rúbrica (100 puntos)
- (25) **Sesión**: login, cookie segura, store persistente, protección de rutas, logout que invalida.
- (25) **JWT**: access + refresh, expiración, rotación y revocación, logout que invalida.
- (15) **Seguridad**: helmet, rate limit, CSRF (solo en flujo sesión / formularios), SameSite/HttpOnly/Secure, prevención de fixation.
- (15) **Roles/Scopes**: middleware RBAC (p.ej. admin/user) y una ruta con permisos diferenciados.
- (10) **Pruebas**: colección Postman/supertest cubriendo success/failure y casos límite.
- (10) **Docs/UX**: README claro, scripts npm, variables de entorno, diagrama corto del flujo.

**Extra (hasta +10):** 2FA TOTP, recordar dispositivo (“remember‑me”), Redis store, auditoría de sesiones/tokens.

---

## Cronograma (6h)
**H0:00–0:25** — Kickoff, clonar plantilla (o crear desde cero), configurar entorno.  
**H0:25–1:30** — Fase 1: **Auth por sesión + cookies**.  
**H1:30–2:45** — Fase 2: **Auth por JWT (access + refresh)**.  
**H2:45–3:15** — Fase 3: **Roles/Scopes** y guardas.  
**H3:15–4:15** — Fase 4: **Endurecimiento seguridad** (helmet, rate limit, CSRF, fixation, SameSite).  
**H4:15–5:15** — Fase 5: **Pruebas automatizadas** (Postman/newman o supertest).  
**H5:15–6:00** — Fase 6: **Pulido, README, demo**.

---

## Requisitos previos
- Node.js 18+
- npm o pnpm
- MongoDB/PostgreSQL (o Redis si usarás session store)
- Postman/newman o Jest + supertest
- Variables `.env` (ejemplo abajo)

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=super-secret-please-change
JWT_ACCESS_SECRET=access-secret-change
JWT_REFRESH_SECRET=refresh-secret-change
ACCESS_TTL=10m
REFRESH_TTL=7d
DATABASE_URL=mongodb://localhost:27017/hackathon14
REDIS_URL=redis://localhost:6379
CSRF_SECRET=csrf-change-me
```

---

## Estructura sugerida
```
hackathon-auth/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  ├─ env.js
│  │  └─ session.js
│  ├─ db/
│  │  └─ index.js
│  ├─ middleware/
│  │  ├─ authSession.js
│  │  ├─ authJwt.js
│  │  ├─ requireRole.js
│  │  └─ csrf.js
│  ├─ routes/
│  │  ├─ authSession.routes.js
│  │  ├─ authJwt.routes.js
│  │  └─ private.routes.js
│  ├─ services/
│  │  ├─ user.service.js
│  │  └─ token.service.js
│  └─ utils/
│     ├─ passwords.js
│     └─ tokens.js
├─ test/ (o collections/)
├─ package.json
├─ README.md
└─ .env.example
```

---

## Fase 1 — Autenticación con **Sesión** + Cookies (≈ 65 min)
### 1.1 Configurar `express-session` y `cookie-parser`
- Habilita cookies seguras: `httpOnly: true`, `sameSite: 'lax' | 'strict'`, `secure: true` en producción.
- **Prevención de fixation**: al hacer login exitoso, **regenera** la sesión (`req.session.regenerate(...)`).

**Snippet guía:**
```js
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1); // si está detrás de proxy (Heroku/Render/Nginx)

app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 15 // 15 min
  }
  // store: new RedisStore({ client }) // recomendado
}));
```

### 1.2 Endpoints mínimos (sesión)
- `POST /session/login` — recibe `{email, password}`
  - Valida credenciales, `req.session.regenerate`, setea `req.session.user = { id, role }`
- `POST /session/logout` — destruye la sesión (`req.session.destroy`) y envía cookie expirada
- `GET /me` — retorna info del usuario logueado desde `req.session.user`
- Middleware `requireAuthSession` — bloquea si no hay sesión

**Snippet guía (login):**
```js
app.post("/session/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  req.session.regenerate(err => {
    if (err) return res.status(500).json({ error: "Session error" });
    req.session.user = { id: user.id, role: user.role };
    res.json({ ok: true });
  });
});
```

---

## Fase 2 — Autenticación con **JWT** (≈ 75 min)
### 2.1 Flujo mínimo
- `POST /jwt/login` — genera **access** (corto) + **refresh** (largo), devuelve access en **JSON**, refresh en **cookie HttpOnly** (o en body si prefieres) → **no** guardar access en localStorage si puedes evitarlo.
- `POST /jwt/refresh` — rota refresh token (invalida el anterior) y devuelve nuevo access.
- `POST /jwt/logout` — revoca refresh y “blacklistea” access opcionalmente.
- Middleware `requireAuthJwt` — valida access token en `Authorization: Bearer ...`.

**Snippet guía (emisión):**
```js
import jwt from "jsonwebtoken";

function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TTL });
}
function signRefresh(payload, jti) {
  return jwt.sign({ ...payload, jti }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TTL });
}
```

### 2.2 Persistencia y revocación
- Mantén una tabla/colección `refresh_tokens` con `{jti, userId, revoked, expiresAt}`.
- En `refresh`, verifica que `jti` **no esté revocado** y rota (marca como revocado y crea nuevo).

---

## Fase 3 — **Roles/Scopes** (≈ 30 min)
- `requireRole('admin')` o `requireScope('billing:read')`.
- Rutas de ejemplo:
  - `GET /admin/stats` (solo admin)
  - `GET /orders/:id` (owner o admin)

**Snippet guía:**
```js
export const requireRole = (...roles) => (req, res, next) => {
  const actor = req.user || req.session?.user;
  if (!actor || !roles.includes(actor.role)) return res.sendStatus(403);
  next();
};
```

---

## Fase 4 — **Seguridad** (≈ 60 min)
- **helmet**: cabeceras por defecto.
- **rate‑limit**: p. ej. 100 req/15m por IP (más estricto en `/login`).
- **CSRF**: aplica en flujos basados en **sesión** y **formularios** (no en APIs stateless puras).
- **SameSite/HttpOnly/Secure**: correctamente seteado.
- **Session Fixation**: regenerar sesión en login y rotar `sid` cuando sube de privilegios.
- **CORS**: restringe orígenes en dev/prod.

---

## Fase 5 — **Pruebas** (≈ 60 min)
- Crea **colección Postman** o `supertest` con casos:
  - Éxito y error en `login` (sesión/JWT)
  - Acceso a `/me` sin y con auth
  - Acceso a ruta `admin` con/ sin rol
  - `refresh` válido, **refresh** expirado/revocado
  - CSRF (si aplica) con token correcto/incorrecto

**Ejemplos con `supertest`:**
```js
import request from "supertest";
import { app } from "../src/app.js";

test("session login fails with wrong password", async () => {
  const res = await request(app).post("/session/login").send({ email:"a@a.com", password:"x" });
  expect(res.status).toBe(401);
});
```

---

## Fase 6 — **Entrega** (≈ 45 min)
- `README.md` con:
  - Variables de entorno, scripts npm
  - Cómo correr tests / importar colección Postman
  - Diagrama simple (ASCII/imagen) de ambos flujos
- Captura de pruebas pasando o `newman run collection.json` exportado

---

## Retos (elige 2 o más)
1. **Remember‑me**: cookie secundaria de larga vida que emite un nuevo `sid`/access con 2FA suave.
2. **2FA TOTP**: enrolamiento con secreto base32, verificación con ventana de tiempo.
3. **Redis Session Store**: usar `connect-redis` con expiración y “touch” en actividad.
4. **Lista negra de access tokens**: blacklisting por `jti` en memoria/Redis por expiración corta.
5. **Auditoría**: tabla `auth_events` (login_failed, login_success, refresh_rotated, logout).
6. **Account lockout** progresivo (p. ej. 5 intentos fallidos → enfriar 15 min).

---

## Endpoints requeridos (mínimo)
### Sesión
- `POST /session/login`
- `POST /session/logout`
- `GET /me` (devuelve `{id, email, role}`)

### JWT
- `POST /jwt/login`
- `POST /jwt/refresh`
- `POST /jwt/logout`
- `GET /jwt/me` (Bearer)

### Privados
- `GET /private/profile` (auth requerida)
- `GET /admin/stats` (admin)

---

## Matriz de pruebas rápida (extracto)
| Caso | Ruta | Esperado |
|---|---|---|
| Login sesión correcto | POST /session/login | 200 + cookie `sid` |
| Acceso sin sesión | GET /me | 401/403 |
| Login JWT correcto | POST /jwt/login | 200 + access + refresh |
| Refresh válido | POST /jwt/refresh | 200 + nuevo access (y refresh rotado) |
| Admin sin rol | GET /admin/stats | 403 |
| CSRF inválido (sesión) | POST /x-form | 403 |

---

## Scripts npm sugeridos
```json
{
  "scripts": {
    "dev": "node --env-file=.env --watch src/server.js",
    "start": "node src/server.js",
    "test": "node --test",
    "lint": "eslint ."
  }
}
```

---

## Consejos
- **No mezcles** CSRF con JWT puro stateless; úsalo en flujos con **cookies/sesión/form**.
- En producción, **Secure + SameSite=Lax/Estrict** y `trust proxy` configurado.
- Expira y rota tokens/`sid` en cambios de privilegio.
- Loguea eventos de seguridad mínimamente.

¡Éxitos! 🚀
6