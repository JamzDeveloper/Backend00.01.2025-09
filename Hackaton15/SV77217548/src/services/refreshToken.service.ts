import {Types} from "mongoose";
import RefreshToken from "../models/refreshToken.model";

export type CreateRefreshTokenPayload = {
    userId: Types.ObjectId;
    jti: string;
    expiresAt: Date;
};

export const createRefreshToken = (payload: CreateRefreshTokenPayload) =>
    RefreshToken.create(payload);

export const findRefreshToken = (jti: string) => RefreshToken.findOne({jti});

export const revokeRefreshToken = (jti: string) =>
    RefreshToken.updateOne({jti}, {$set: {revoked: true}});
