const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messagesContainer = document.getElementById("messages");

function addMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  
  if (sender === "bot") {
    div.innerHTML = marked.parse(text);
  } else {
    div.textContent = text;
  }
  
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Mensaje inicial
addMessage(
  "Hola 👋, soy tu asistente de productividad. Contame tus tareas y te ayudo.",
  "bot"
);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  input.focus();

  const thinking = document.createElement("div");
  thinking.classList.add("message", "bot");
  thinking.textContent = "Pensando...";
  messagesContainer.appendChild(thinking);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();
    thinking.remove();

    addMessage(data.reply || "Error en la respuesta", "bot");
  } catch (err) {
    thinking.remove();
    addMessage("Error conectando con el servidor.", "bot");
  }
});
