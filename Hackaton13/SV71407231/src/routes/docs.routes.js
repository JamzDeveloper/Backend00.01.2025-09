import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const router = Router();

const swaggerDocument = YAML.load("src/docs/openapi.yaml");

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

export default router;