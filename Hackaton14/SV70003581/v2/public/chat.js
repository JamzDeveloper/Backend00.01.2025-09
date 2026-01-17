const messages = document.querySelector("#messages");
const input = document.getElementById("input");
const buttonSend = document.getElementById("sendButton");

function generateUserNameRandom() {
  const adjectives = ["Rápido", "Feliz", "Inteligente", "Valiente", "Creativo"];
  const nouns = ["Tigre", "Águila", "León", "Delfín", "Lobo"];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective}${noun}${Math.floor(Math.random() * 1000)}`;
}

function addMessageToUi(data, isUserMessage) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (isUserMessage) {
    messageElement.classList.add("user-message");
  }

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.textContent = data.username.charAt(0).toUpperCase();

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  const messageText = document.createElement("p");
  messageText.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;

  messageContent.appendChild(messageText);
  messageElement.appendChild(avatar);
  messageElement.appendChild(messageContent);

  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}

const socket = io();

let username = localStorage.getItem("username");
if (!username) {
  username = generateUserNameRandom();
  localStorage.setItem("username", username);
}

buttonSend.addEventListener("click", (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  const data = { username, message };

  socket.emit("chat event", data);
  addMessageToUi(data, true);

  input.value = "";
});

socket.on("response", (data) => {
  if (data.username !== username) {
    addMessageToUi(data, false);
  }
});
