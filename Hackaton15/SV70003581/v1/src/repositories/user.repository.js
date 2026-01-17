/*
    DEFINIR OPERACIONES CRUD
*/

import { db } from "../config/db.js";
//import user from "../models/user.model.js"

export class UserRepository {
    async getAllUsers() {
        return db.users;
    }
    async getUserByRole(role) {
        return db.users.filter((user) => user.role === role);
    }
    async getUserById(id) {
        return db.users.find((user) => user.id === id);
    }
    async getUserByEmail(email) {
        return db.users.find((user) => user.email === email);
    }
}

export const userRepository = new UserRepository();