import { Express, RequestHandler, Request, Response } from "express";
import { verifySignUp } from "../middlewares";
import * as controller from "../controllers/auth.controller";

export default function authRoutes(app: Express) {
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });

    /**
     * @swagger
     * components:
     *   schemas:
     *     SignupRequest:
     *       type: object
     *       required:
     *         - username
     *         - email
     *         - password
     *       properties:
     *         username:
     *           type: string
     *           example: "pepe"
     *         email:
     *           type: string
     *           format: email
     *           example: "pepe@correo.com"
     *         password:
     *           type: string
     *           format: password
     *           example: "123456"
     *         roles:
     *           type: array
     *           items:
     *             type: string
     *           example: ["user"]
     *     SigninRequest:
     *       type: object
     *       required:
     *         - username
     *         - password
     *       properties:
     *         username:
     *           type: string
     *           example: "pepe"
     *         password:
     *           type: string
     *           format: password
     *           example: "123456"
     *     SignupResponse:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *           example: "Usuario Creado Correctamente"
     *     SigninResponse:
     *       type: object
     *       properties:
     *         id:
     *           type: string
     *           example: "507f1f77bcf86cd799439011"
     *         username:
     *           type: string
     *           example: "pepe"
     *         email:
     *           type: string
     *           format: email
     *           example: "pepe@correo.com"
     *         roles:
     *           type: array
     *           items:
     *             type: string
     *           example: ["user"]
     *     MessageResponse:
     *       type: object
     *       properties:
     *         message:
     *           type: string
     *           example: "Tu sesion ha terminado"
     */

    /**
     * @swagger
     * /api/auth/signup:
     *   post:
     *     summary: Registrar usuario
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/SignupRequest"
     *     responses:
     *       200:
     *         description: Usuario creado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/SignupResponse"
     *       500:
     *         description: Error en el servidor.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/MessageResponse"
     */
    app.post("/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail as RequestHandler,
            verifySignUp.checkRoleExisted as RequestHandler
        ],
        controller.signup);

    /**
     * @swagger
     * /api/auth/signout:
     *   post:
     *     summary: Cerrar sesion
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: Sesion cerrada.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/MessageResponse"
     *       500:
     *         description: Error en el servidor.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/MessageResponse"
     */
    app.post("/api/auth/signout",controller.signout);

    /**
     * @swagger
     * /api/auth/signin:
     *   post:
     *     summary: Iniciar sesion
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/SigninRequest"
     *     responses:
     *       200:
     *         description: Usuario autenticado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/SigninResponse"
     *       401:
     *         description: Password invalido.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/MessageResponse"
     *       404:
     *         description: Usuario no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/MessageResponse"
     *       500:
     *         description: Error en el servidor.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/MessageResponse"
     */
    app.post("/api/auth/signin", controller.signin)
}
