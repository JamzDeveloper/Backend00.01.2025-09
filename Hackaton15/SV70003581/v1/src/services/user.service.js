/*
    APLICAR LÓGICA DE NEGOCIO
*/

import { userRepository } from "../repositories/user.repository.js";

export class UserService {
    async getUserByEmail(email) {
        return await userRepository.getUserByEmail(email);
    }
    async getAllUsers() {
        return await userRepository.getAllUsers();
    }
    async getOnlyUsers() {
        return await userRepository.getUserByRole("user");
    }
    async getOnlyAdmins() {
        return await userRepository.getUserByRole("admin");
    }
    async getUserById(id) {
        return await userRepository.getUserById(id)            
    }
}

export const userService = new UserService();

