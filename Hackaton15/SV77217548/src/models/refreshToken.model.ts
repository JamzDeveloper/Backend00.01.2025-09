import {Schema, model, Document, Types} from "mongoose";

export interface RefreshTokenDocument extends Document {
    userId: Types.ObjectId;
    jti: string;
    revoked: boolean;
    expiresAt: Date;
}

const RefreshTokenSchema = new Schema<RefreshTokenDocument>(
    {
        userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
        jti: {type: String, required: true, unique: true},
        revoked: {type: Boolean, default: false},
        expiresAt: {type: Date, required: true},
    },
    {timestamps: true}
);

RefreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

const RefreshToken = model<RefreshTokenDocument>("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
