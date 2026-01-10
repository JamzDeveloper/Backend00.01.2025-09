import { db } from "../db/index.js";
export const findUserByEmail = (email = "") => {
  return db.users.find((user) => user.email === email);
};

export const findAllUser = () => {
  return db.users;
};
