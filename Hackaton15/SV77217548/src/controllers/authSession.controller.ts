import {Request, Response} from "express";
import * as userService from "../services/user.service";
import {hashPassword, verifyPassword} from "../utils/passwords";

const allowedRoles = new Set(["user", "admin", "moderator"]);

export const register = async (req: Request, res: Response) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const rawRole = typeof req.body.role === "string" ? req.body.role.trim() : "";

    if (!email || !password){
        return res.status(400).json({message: "Email y password son requeridos"});
    }

    const existing = await userService.findUserByEmail(email);
    if (existing){
        return res.status(400).json({message: "El email ya esta en uso"});
    }

    const role = allowedRoles.has(rawRole) ? rawRole : "user";
    const passwordHash = await hashPassword(password);
    const user = await userService.createUser({email, passwordHash, role});

    return res.status(201).json({id: user.id, email: user.email, role: user.role});
};

export const login = async (req: Request, res: Response) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password){
        return res.status(400).json({message: "Email y password son requeridos"});
    }

    const user = await userService.findUserByEmail(email);
    if (!user){
        return res.status(401).json({message: "Credenciales invalidas"});
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid){
        return res.status(401).json({message: "Credenciales invalidas"});
    }

    return req.session.regenerate((err) => {
        if (err){
            return res.status(500).json({message: "Error al crear la sesion"});
        }
        req.session.user = {id: user.id, email: user.email, role: user.role};
        return res.status(200).json({ok: true});
    });
};

export const logout = (req: Request, res: Response) => {
    return req.session.destroy((err) => {
        if (err){
            return res.status(500).json({message: "Error al cerrar sesion"});
        }
        res.clearCookie("sid");
        return res.status(200).json({message: "Sesion cerrada"});
    });
};

export const me = (req: Request, res: Response) => {
    if (!req.session || !req.session.user){
        return res.status(401).json({message: "No hay sesion activa"});
    }
    return res.json({user: req.session.user});
};
