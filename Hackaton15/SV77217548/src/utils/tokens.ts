import jwt, {JwtPayload, SignOptions} from "jsonwebtoken";
import env from "../config/env";

export type AccessTokenPayload = {
    id: string;
    role: string;
};

export type RefreshTokenPayload = {
    id: string;
    jti: string;
};

const toExpiresIn = (value: string): SignOptions["expiresIn"] =>
    value as SignOptions["expiresIn"];

export const signAccessToken = (payload: AccessTokenPayload) => {
    if (!env.JWT_ACCESS_SECRET){
        throw new Error("Falta JWT_ACCESS_SECRET en el archivo .env");
    }
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {expiresIn: toExpiresIn(env.ACCESS_TTL)});
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
    if (!env.JWT_REFRESH_SECRET){
        throw new Error("Falta JWT_REFRESH_SECRET en el archivo .env");
    }
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {expiresIn: toExpiresIn(env.REFRESH_TTL)});
};

export const verifyAccessToken = (token: string): JwtPayload => {
    if (!env.JWT_ACCESS_SECRET){
        throw new Error("Falta JWT_ACCESS_SECRET en el archivo .env");
    }
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof decoded === "string"){
        throw new Error("Token invalido");
    }
    return decoded;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    if (!env.JWT_REFRESH_SECRET){
        throw new Error("Falta JWT_REFRESH_SECRET en el archivo .env");
    }
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (typeof decoded === "string"){
        throw new Error("Token invalido");
    }
    return decoded;
};

export const getTokenExpiresAt = (token: string): Date | null => {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded || !decoded.exp){
        return null;
    }
    return new Date(decoded.exp * 1000);
};
