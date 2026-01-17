import mongoose, { Schema, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    history: [{
      type: String,
      trim: true,
    },],
    datetime: [{
      type: String,
      trim: true,
    },],

    user: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("message", MessageSchema);

export { MessageModel };