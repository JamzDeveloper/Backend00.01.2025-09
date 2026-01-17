import { MessageModel } from "../models/message.model.js";

export async function findByUser(user) {
  return MessageModel.findOne({ user });
}

export async function createMessage(data) {
  return MessageModel.create(data);
}

export async function appendMessage(user, message, datetime) {
  return MessageModel.updateOne(
    { user },
    { $push: { history: message, datetime } }
  );
}
