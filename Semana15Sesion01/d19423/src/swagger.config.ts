// swagger.config.ts
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const protocol = process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH ? "https" : "http";
const port = process.env.PORT || "8080";
const url: string = `${protocol}://localhost:${port}`;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TypeScript Express API with Swagger by Roberto Pineda',
      version: '1.0.1',
      description: 'A sample API documented with Swagger by RP',
    },
    servers: [
      {
        url,
      },
    ],
  },
  // Path to the API docs (route files)
  apis: [path.join(__dirname, "routes", "*.{ts,js}")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
