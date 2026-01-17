import {Request, Response, CookieOptions} from "express";
import {randomUUID} from "crypto";
import env from "../config/env";
import * as userService from "../services/user.service";
import * as refreshTokenService from "../services/refreshToken.service";
import {verifyPassword} from "../utils/passwords";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    getTokenExpiresAt,
} from "../utils/tokens";

const buildRefreshCookieOptions = (expiresAt: Date | null): CookieOptions => {
    const options: CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
    };
    if (expiresAt){
        options.expires = expiresAt;
    }
    return options;
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

    try {
        const accessToken = signAccessToken({id: user.id, role: user.role});
        const jti = randomUUID();
        const refreshToken = signRefreshToken({id: user.id, jti});
        const expiresAt = getTokenExpiresAt(refreshToken) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await refreshTokenService.createRefreshToken({userId: user._id, jti, expiresAt});

        res.cookie("refreshToken", refreshToken, buildRefreshCookieOptions(expiresAt));
        return res.status(200).json({accessToken});
    } catch (error) {
        return res.status(500).json({message: "JWT no configurado"});
    }
};

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token){
        return res.status(401).json({message: "Refresh token requerido"});
    }

    try {
        const payload = verifyRefreshToken(token);
        const jti = typeof payload.jti === "string" ? payload.jti : "";
        const userId = typeof payload.id === "string" ? payload.id : "";
        if (!jti || !userId){
            return res.status(401).json({message: "Refresh token invalido"});
        }

        const stored = await refreshTokenService.findRefreshToken(jti);
        if (!stored || stored.revoked){
            return res.status(401).json({message: "Refresh token invalido"});
        }

        if (stored.expiresAt < new Date()){
            return res.status(401).json({message: "Refresh token expirado"});
        }

        const user = await userService.findUserById(userId);
        if (!user){
            return res.status(401).json({message: "Usuario no encontrado"});
        }

        await refreshTokenService.revokeRefreshToken(jti);

        const newJti = randomUUID();
        const newRefreshToken = signRefreshToken({id: user.id, jti: newJti});
        const newExpiresAt = getTokenExpiresAt(newRefreshToken) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await refreshTokenService.createRefreshToken({userId: user._id, jti: newJti, expiresAt: newExpiresAt});

        const accessToken = signAccessToken({id: user.id, role: user.role});
        res.cookie("refreshToken", newRefreshToken, buildRefreshCookieOptions(newExpiresAt));
        return res.status(200).json({accessToken});
    } catch (error) {
        return res.status(401).json({message: "Refresh token invalido"});
    }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken as string | undefined;

    if (token){
        try {
            const payload = verifyRefreshToken(token);
            const jti = typeof payload.jti === "string" ? payload.jti : "";
            if (jti){
                await refreshTokenService.revokeRefreshToken(jti);
            }
        } catch (error) {
            // Token invalido, se limpia la cookie igual.
        }
    }

    res.clearCookie("refreshToken");
    return res.status(200).json({message: "Sesion JWT cerrada"});
};

export const me = async (req: Request, res: Response) => {
    if (!req.auth){
        return res.status(401).json({message: "Token requerido"});
    }

    const user = await userService.findUserById(req.auth.id);
    if (!user){
        return res.status(404).json({message: "Usuario no encontrado"});
    }

    return res.json({id: user.id, email: user.email, role: user.role});
};
