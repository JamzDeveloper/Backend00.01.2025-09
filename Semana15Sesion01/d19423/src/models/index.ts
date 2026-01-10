import mongoose from "mongoose";
import Role from "./role.model";
import User from "./user.model";

export const ROLES = ["admin", "moderator", "user"] as const;

const init = async (): Promise<void> => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
        ROLES.forEach(async element => {
            await new Role({ name: element }).save();
        });
      console.log("Roles iniciales creados");
    }
  } catch (error) {
    console.error("Error al inicializar roles", error);
  }
};

const db = {
  mongoose,
  user: User,
  role: Role,
  ROLES,
  init,
};

export default db;
