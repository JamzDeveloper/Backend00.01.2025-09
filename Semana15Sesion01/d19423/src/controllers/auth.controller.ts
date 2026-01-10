import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models";
import { IRole } from "../models/role.model";

const { user: User, role: Role } = db;

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password, roles } = req.body as {
            username: string;
            email: string;
            password: string;
            roles?: string[];
        };
        const user = new User({
            username,
            email,
            password: bcrypt.hashSync(password, 8),
        });
        await user.save();
        if (Array.isArray(roles) && roles.length > 0) {
            const foundRoles = await Role.find({ name: { $in: roles } }).exec();
            user.roles = foundRoles.map((roleDoc: IRole) => roleDoc._id);
        } else {
            const defaultRole = await Role.findOne({ name: "user" }).exec();
            if (defaultRole) {
                user.roles = [defaultRole._id];
            }
        }
        await user.save();
        res.send({ message: "Usuario Creado Correctamente" });
    } catch (err) {
        const message = err instanceof Error ? err.message : err;
        res.status(500).send({ message });
    }

}

export const signout = (req: Request, res: Response) => {
    try {
        req.session = null;
        res.status(200).send({ message: "Tu sesion ha terminado" });
    } catch (error) {
        const message = error instanceof Error ? error.message : error;
        res.status(500).send({ message });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.body.username })
            .populate("roles", "-__v")
            .exec();
        if (!user) {
            res.status(404).send({ message: "Usuario no encontrado" });
            return;
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            res.status(401).send({ message: "Password Invalido" });
            return;
        }

        if (!process.env.JWT_SECRET) {
            res.status(500).send({ message: "JWT_SECRET no está configurado" });
            return;
        }

        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: 86400,
            }
        );
        const authorities = (user.roles as unknown as IRole[]).map((role) =>
            role && "name" in role ? (role as IRole).name : String(role)
        );
        if (req.session) {
            req.session.token = token;
        }
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : error;
        res.status(500).send({ message });
    }
}