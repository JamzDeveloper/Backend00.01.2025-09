import { db } from "../db/index.js";
export const findUserByEmail = (email = "") => {
  return db.users.find((user) => user.email === email);
};

export const findAllUser = () => {
  return db.users;
};

export const findUserById = (id) => {
  return db.users.find((user) => user.id === id);
};

export const findAdminUser = () => {
  return db.users.filter((user) => user.role === "admin");
};
