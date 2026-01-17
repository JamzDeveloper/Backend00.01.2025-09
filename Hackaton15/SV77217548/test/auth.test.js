const {test, before, after} = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

process.env.NODE_ENV = "test";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test-session-secret";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-access-secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret";
process.env.ACCESS_TTL = process.env.ACCESS_TTL || "5m";
process.env.REFRESH_TTL = process.env.REFRESH_TTL || "1d";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL || "mongodb://127.0.0.1:27017/sv77217548_h15_test";

const appModule = require("../dist/app.js");
const app = appModule.default || appModule;

const makeEmail = (prefix) =>
    `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@correo.com`;

before(async () => {
    await mongoose.connect(process.env.DATABASE_URL);
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

test("flujo de sesion con CSRF", async () => {
    const agent = request.agent(app);
    const email = makeEmail("session");

    const register = await agent
        .post("/session/register")
        .send({email, password: "secret123", role: "user"});
    assert.equal(register.status, 201);

    const login = await agent
        .post("/session/login")
        .send({email, password: "secret123"});
    assert.equal(login.status, 200);

    const me = await agent.get("/me");
    assert.equal(me.status, 200);
    assert.equal(me.body.user.email, email);

    const csrf = await agent.get("/csrf");
    assert.equal(csrf.status, 200);
    assert.ok(csrf.body.csrfToken);

    const logout = await agent
        .post("/session/logout")
        .set("X-CSRF-Token", csrf.body.csrfToken);
    assert.equal(logout.status, 200);
});

test("flujo JWT con acceso protegido", async () => {
    const email = makeEmail("jwt");

    const register = await request(app)
        .post("/session/register")
        .send({email, password: "secret123", role: "user"});
    assert.equal(register.status, 201);

    const login = await request(app)
        .post("/jwt/login")
        .send({email, password: "secret123"});
    assert.equal(login.status, 200);
    assert.ok(login.body.accessToken);

    const me = await request(app)
        .get("/jwt/me")
        .set("Authorization", `Bearer ${login.body.accessToken}`);
    assert.equal(me.status, 200);
    assert.equal(me.body.email, email);
});

test("admin/stats requiere rol admin", async () => {
    const userEmail = makeEmail("user");
    const adminEmail = makeEmail("admin");

    const registerUser = await request(app)
        .post("/session/register")
        .send({email: userEmail, password: "secret123", role: "user"});
    assert.equal(registerUser.status, 201);

    const loginUser = await request(app)
        .post("/jwt/login")
        .send({email: userEmail, password: "secret123"});
    assert.equal(loginUser.status, 200);
    assert.ok(loginUser.body.accessToken);

    const forbidden = await request(app)
        .get("/admin/stats")
        .set("Authorization", `Bearer ${loginUser.body.accessToken}`);
    assert.equal(forbidden.status, 403);

    const registerAdmin = await request(app)
        .post("/session/register")
        .send({email: adminEmail, password: "secret123", role: "admin"});
    assert.equal(registerAdmin.status, 201);

    const loginAdmin = await request(app)
        .post("/jwt/login")
        .send({email: adminEmail, password: "secret123"});
    assert.equal(loginAdmin.status, 200);
    assert.ok(loginAdmin.body.accessToken);

    const allowed = await request(app)
        .get("/admin/stats")
        .set("Authorization", `Bearer ${loginAdmin.body.accessToken}`);
    assert.equal(allowed.status, 200);
});
