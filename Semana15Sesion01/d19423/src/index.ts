console.log("Inicio de la aplicacion")
import * as dotenv from 'dotenv';
dotenv.config();
import compression from "compression";
import cookieSession from "cookie-session";
import express from "express";
import rateLimit from "express-rate-limit";
import https from "https";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import db from './models';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.config';

import authRoutes from './routes/auth.route';
import userRoute from './routes/user.route';

const PORT = Number(process.env.PORT) || 8080;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const MONGO_URI = process.env.MONGO_URI
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const app = express();

app.use(
  cookieSession({
    name: "auth-session",
    keys: [COOKIE_SECRET || "dev-secret"],
    httpOnly: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

const limiter = rateLimit({ windowMs: 60_000, max: 100 });
app.use("/api/", limiter);

app.get("/", (_req, res) => {
  res.send("Hola");
});

import swaggerDocument from './swagger-output.json'; // Adjust path as needed
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

authRoutes(app);
userRoute(app)

const start = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI no está configurado");
    }
    if ((SSL_KEY_PATH && !SSL_CERT_PATH) || (!SSL_KEY_PATH && SSL_CERT_PATH)) {
      throw new Error("SSL_KEY_PATH y SSL_CERT_PATH deben estar configurados juntos");
    }
    await db.mongoose.set('strictQuery', true);
    await db.mongoose.connect(MONGO_URI, {});
    console.log("Estas conectado");
    await db.init();
    const protocol = SSL_KEY_PATH && SSL_CERT_PATH ? "https" : "http";
    if (protocol === "https") {
      const key = fs.readFileSync(SSL_KEY_PATH as string);
      const cert = fs.readFileSync(SSL_CERT_PATH as string);
      https.createServer({ key, cert }, app).listen(PORT, () => {
        console.log(`Servidor iniciado en el puerto ${PORT}`);
        console.log(`Swagger UI available at https://localhost:${PORT}/api-docs`);
      });
      return;
    }
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
