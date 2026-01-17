/*
    Recibir peticiones HTTP
    Validar superficialmente datos de entrada (existencia, tipo y formato)
    Retornar respuestas HTTP
*/

import { userService } from "../services/user.service.js";
import { verifyPassword } from "../utils/passwords.js";


export async function logIn(req, res) {
    
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
console.log(user)
    if (!user || !verifyPassword(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.regenerate((err) => {
        if (err) return res.status(500).json({ error: "Session error" });

        req.session.user = { id: user.id, email: user.email, role: user.role };
        res.json({ ok: true });
    });
};

export function me (req, res) {
    res.json({ user: req.session.user });
};

export function logOut(req, res) {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout error" });

        res.clearCookie("sid");
        res.json({ ok: true });
    });
};