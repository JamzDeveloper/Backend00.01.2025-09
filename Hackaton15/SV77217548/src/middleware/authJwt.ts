import {Request, Response, NextFunction} from "express";
import {verifyAccessToken} from "../utils/tokens";

const requireAuthJwt = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    if (!token){
        return res.status(401).json({message: "Token requerido"});
    }

    try {
        const payload = verifyAccessToken(token);
        if (!payload.id || typeof payload.id !== "string"){
            return res.status(401).json({message: "Token invalido"});
        }
        const role = typeof payload.role === "string" ? payload.role : "user";
        req.auth = {id: payload.id, role};
        return next();
    } catch (error) {
        return res.status(401).json({message: "Token invalido"});
    }
};

export default requireAuthJwt;
