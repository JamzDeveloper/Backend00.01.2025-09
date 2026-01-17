import User from "../models/user.model";

export type CreateUserPayload = {
    email: string;
    passwordHash: string;
    role: string;
};

export const createUser = (payload: CreateUserPayload) => User.create(payload);

export const findUserByEmail = (email: string) => User.findOne({email});

export const findUserById = (id: string) => User.findById(id);
