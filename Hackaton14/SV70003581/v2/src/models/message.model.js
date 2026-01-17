import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    history: [{ type: String, trim: true }],
    datetime: [{ type: Date }],
    user: { type: String }
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("message", MessageSchema);
