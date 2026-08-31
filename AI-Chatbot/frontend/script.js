async function sendMessage() {

    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Show user's message
    const userMessage = document.createElement("div");

    userMessage.className = "user-message";

    userMessage.innerText = message;

    chatBox.appendChild(userMessage);

    input.value = "";

    // Show loading message
    const loadingMessage = document.createElement("div");

    loadingMessage.className = "bot-message";

    loadingMessage.innerText = "Thinking...";

    chatBox.appendChild(loadingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("http://localhost:5000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        loadingMessage.innerText = data.reply;

    } catch (error) {

        console.error(error);

        loadingMessage.innerText =
            "Unable to connect to the server.";

    }

    chatBox.scrollTop = chatBox.scrollHeight;
}


// Press Enter to send
document.getElementById("userInput").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});