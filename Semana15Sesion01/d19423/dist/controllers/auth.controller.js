"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signout = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = __importDefault(require("../models"));
const { user: User, role: Role } = models_1.default;
const signup = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;
        const user = new User({
            username,
            email,
            password: bcryptjs_1.default.hashSync(password, 8),
        });
        await user.save();
        if (Array.isArray(roles) && roles.length > 0) {
            const foundRoles = await Role.find({ name: { $in: roles } }).exec();
            user.roles = foundRoles.map((roleDoc) => roleDoc._id);
        }
        else {
            const defaultRole = await Role.findOne({ name: "user" }).exec();
            if (defaultRole) {
                user.roles = [defaultRole._id];
            }
        }
        await user.save();
        res.send({ message: "Usuario Creado Correctamente" });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : err;
        res.status(500).send({ message });
    }
};
exports.signup = signup;
const signout = (req, res) => {
    try {
        req.session = null;
        res.status(200).send({ message: "Tu sesion ha terminado" });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : error;
        res.status(500).send({ message });
    }
};
exports.signout = signout;
const signin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
            .populate("roles", "-__v")
            .exec();
        if (!user) {
            res.status(404).send({ message: "Usuario no encontrado" });
            return;
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            res.status(401).send({ message: "Password Invalido" });
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).send({ message: "JWT_SECRET no está configurado" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
        }, process.env.JWT_SECRET, {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: 86400,
        });
        const authorities = user.roles.map((role) => role && "name" in role ? role.name : String(role));
        if (req.session) {
            req.session.token = token;
        }
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : error;
        res.status(500).send({ message });
    }
};
exports.signin = signin;
