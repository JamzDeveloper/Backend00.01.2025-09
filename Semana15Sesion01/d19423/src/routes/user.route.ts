import { Express } from "express";
import { authJwt } from "../middlewares"
import * as controller from "../controllers/user.controller";

export default (app: Express) => {
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  /**
   * @swagger
   * components:
   *   schemas:
   *     ErrorMessage:
   *       type: object
   *       properties:
   *         message:
   *           type: string
   *           example: "Usuario no encontrado"
   */

  /**
   * @swagger
   * /api/test/all:
   *   get:
   *     summary: Contenido publico
   *     tags: [Test]
   *     responses:
   *       200:
   *         description: Texto de contenido publico.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "Contenido Public"
   */
  app.get("/api/test/all", controller.allAccess);

  /**
   * @swagger
   * /api/test/user:
   *   get:
   *     summary: Contenido para usuarios autenticados
   *     tags: [Test]
   *     responses:
   *       200:
   *         description: Texto de contenido del usuario.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "Contenido del Usuario pepe"
   *       401:
   *         description: Token no encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorMessage"
   *       404:
   *         description: Usuario no encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorMessage"
   */
  app.get("/api/test/user",[authJwt.verifyToken], controller.onlyUser)

  /**
   * @swagger
   * /api/test/moderator:
   *   get:
   *     summary: Contenido para moderadores
   *     tags: [Test]
   *     responses:
   *       200:
   *         description: Texto de contenido del moderator.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "Contenido del Moderator"
   *       401:
   *         description: Token no encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorMessage"
   *       403:
   *         description: Se requiere el rol de Moderator.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorMessage"
   */
  app.get("/api/test/moderator",[authJwt.verifyToken, authJwt.isModerator],controller.onlyModerator);

  /**
   * @swagger
   * /api/test/admin:
   *   get:
   *     summary: Contenido para administradores
   *     tags: [Test]
   *     responses:
   *       200:
   *         description: Texto de contenido del admin.
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "Contenido del Admin"
   *       401:
   *         description: Token no encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorMessage"
   *       403:
   *         description: Se requiere el rol de Administrador.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorMessage"
   */
  app.get("/api/test/admin",[authJwt.verifyToken, authJwt.isAdmin],controller.onlyAdmin);
}
