import {Schema, model, Document} from "mongoose";

export interface UserDocument extends Document {
    email: string;
    passwordHash: string;
    role: string;
}

const UserSchema = new Schema<UserDocument>(
    {
        email: {type: String, required: true, unique: true, lowercase: true, trim: true},
        passwordHash: {type: String, required: true},
        role: {type: String, default: "user"},
    },
    {timestamps: true}
);

const User = model<UserDocument>("User", UserSchema);

export default User;
