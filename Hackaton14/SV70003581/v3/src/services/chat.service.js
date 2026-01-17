import {
  findByUser,
  createMessage,
  appendMessage
} from "../repositories/message.repository.js";

export async function saveMessage(message, user) {
  const now = new Date();
  const existUser = await findByUser(user);

  if (!existUser) {
    return createMessage({
      history: [message],
      user,
      datetime: [now]
    });
  }

  return appendMessage(user, message, now);
}
