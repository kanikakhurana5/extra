const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", async function () {
  const message = userInput.value.trim();

  if (message) {
    // Append user message to the chat
    appendMessage("user-message", message);

    // Clear the input field
    userInput.value = "";

    try {
      // Send user query to the backend
      const response = await fetch('/getDiagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }), // Send user query to backend
      });

      const data = await response.json();

      // Display ChatGPT's response
      const botResponse = data.answer || "Sorry, I couldn't understand your question.";
      appendMessage("bot-message", botResponse);

    } catch (error) {
      appendMessage("bot-message", "Sorry, I couldn't connect to the ChatGPT API.");
    }
  }
});

// Function to append messages to the chatbox
function appendMessage(className, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(className);
  messageElement.innerHTML = `<p>${message}</p>`;
  chatBox.appendChild(messageElement);

  // Scroll to the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
}
