const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const apiSelector = document.getElementById("api-selector"); // Add a selector to choose the API

sendBtn.addEventListener("click", async function () {
    const message = userInput.value.trim();
    const apiChoice = apiSelector.value; // Get the selected API from the dropdown

    if (message) {
        appendMessage("user-message", message);
        userInput.value = ""; // Clear the input field

        try {
            // Send POST request to server
            const response = await fetch('/getDiagnosis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: message, apiChoice }), // Send query and API choice to server
            });

            const data = await response.json();
            const botResponse = data.answer || "Sorry, I couldn't understand your question.";
            appendMessage("bot-message", botResponse); // Display bot response

        } catch (error) {
            appendMessage("bot-message", "Sorry, I couldn't connect to the API.");
        }
    }
});

function appendMessage(className, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(className);
    messageElement.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}
