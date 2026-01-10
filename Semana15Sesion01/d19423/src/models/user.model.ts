import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
