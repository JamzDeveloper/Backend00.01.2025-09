 import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

    const messages = document.querySelector("#messages");

    function generateUserNameRandom() {
      const adjectives = [
        "Rápido",
        "Feliz",
        "Inteligente",
        "Valiente",
        "Creativo",
      ];
      const nouns = ["Tigre", "Águila", "León", "Delfín", "Lobo"];
      return (
        adjectives[Math.floor(Math.random() * adjectives.length)] +
        nouns[Math.floor(Math.random() * nouns.length)] +
        Math.floor(Math.random() * 1000)
      );
    }

    function addMessageToUi(data, isUserMessage) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      if (isUserMessage) messageElement.classList.add("user-message");

      const avatar = document.createElement("div");
      avatar.classList.add("avatar");
      avatar.textContent = data.username.charAt(0).toUpperCase();

      const content = document.createElement("div");
      content.classList.add("message-content");

      content.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;

      messageElement.append(avatar, content);
      messages.appendChild(messageElement);
      messages.scrollTop = messages.scrollHeight;
    }

    const socket = io();

    let username = localStorage.getItem("username") || generateUserNameRandom();
    localStorage.setItem("username", username);

    document.getElementById("sendButton").addEventListener("click", () => {
      const input = document.getElementById("input");
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