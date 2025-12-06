import { Router } from "express";
import {
    changeStatusItem,
  createItem,
  itemsPending,
  listItems,
} from "../controllers/item.controller.js";

const route = Router();

route.post("/", createItem);

route.get("/", listItems);

route.get("/pending", itemsPending);

route.patch("/:id/completed", changeStatusItem);

export { route as ItemRoute };
