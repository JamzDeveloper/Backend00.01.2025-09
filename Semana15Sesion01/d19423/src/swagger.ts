import swaggerAutogen from 'swagger-autogen';
import path from "path";


const protocol = process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH ? "https" : "http";
const port = process.env.PORT || "8080";
const url: string = `${protocol}://localhost:${port}`;
const host: string = `localhost:${port}`

const doc = {
  info: {
      title: 'TypeScript Express API with Swagger by Roberto Pineda',
      version: '1.0.1',
      description: 'A sample API documented with Swagger by RP',
    },
  host,
  // Other options like security definitions, schemas, etc.
};

const outputFile = './swagger-output.json';
// Use the root file where your main routes are defined (e.g., './src/app.ts' or './dist/app.js' if you build first)
const endpointsFiles = [path.join(__dirname, "routes", "*.{ts,js}")]; 

// Use the ES module default import pattern
swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
  // You can import and start your main application after the docs are generated
  // await import('./src/app.js'); 
});
