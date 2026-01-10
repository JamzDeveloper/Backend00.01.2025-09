import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
  name: string;
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true },
});

const Role = mongoose.model<IRole>("Role", RoleSchema);

export default Role;
