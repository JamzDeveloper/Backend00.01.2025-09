import { Router } from "express";
import {
    changeStatusItem,
  createItem,
  itemsPending,
  itemsCompleted,
  listItems,
  deleteItem,
  updateItem,
  getItem,
} from "../controllers/item.controller.js";

const route = Router();

route.post("/", createItem);

// list all
route.get("/", listItems);

// completed list (must be before /:id)
route.get("/completed", itemsCompleted);

// pending
route.get("/pending", itemsPending);

// operations by id
route.put("/:id", updateItem);
route.get("/:id", getItem);
route.delete("/:id", deleteItem);

// toggle completed
route.patch("/:id/completed", changeStatusItem);

export { route as ItemRoute };
