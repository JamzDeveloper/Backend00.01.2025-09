import { Router } from "express";
import {
    createOrder,
    getOrderId,
    getOrders
} from "../controllers/order.controller.js";
import { validateField } from "../middlewares/validate-field.middleware.js";
import { check } from "express-validator";
import { validateApiToken } from "../middlewares/validate-api-token.middleware.js";

const route = Router();

route.get("/", getOrders);

route.get("/:orderId", getOrderId);

route.post("/",
    [
        check("products", "product is required").not().isEmpty(),
        check("customerId", "customerId is required").not().isEmpty(),
        validateField,
        validateApiToken
    ],
    createOrder
);

export { route as OrderRoute };