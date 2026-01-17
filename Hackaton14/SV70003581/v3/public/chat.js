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
  messageElement.dataset.id = data.id;

  if (isUserMessage) {
    messageElement.classList.add("user-message");
  }

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.textContent = data.username.charAt(0).toUpperCase();

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  const messageText = document.createElement("p");
  messageText.innerHTML = `<strong>${data.username}:</strong> <span class="text">${data.message}</span>`;

  messageContent.appendChild(messageText);

  if (isUserMessage) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editMessage(data.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteMessage(data.id);

    messageContent.append(editBtn, deleteBtn);
  }

  messageElement.append(avatar, messageContent);
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}

function editMessage(id) {
  const newText = prompt("Editar mensaje:");
  if (!newText) return;

  socket.emit("edit message", {
    id,
    message: newText,
  });
}

function deleteMessage(id) {
  if (!confirm("¿Eliminar mensaje?")) return;

  socket.emit("delete message", { id });
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

socket.on("message edited", ({ id, message }) => {
  const msg = document.querySelector(`[data-id="${id}"]`);
  if (msg) {
    msg.querySelector(".text").textContent = message;
  }
});

socket.on("message deleted", ({ id }) => {
  const msg = document.querySelector(`[data-id="${id}"]`);
  if (msg) msg.remove();
});