require("dotenv").config();
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askAI(message) {
    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "openrouter/free",

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a helpful AI assistant. Reply in simple English or Hinglish according to the user's language."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            console.log("\n❌ API Error:", data.error.message);
            return;
        }

        console.log("\n🤖 AI:", data.choices[0].message.content);
    } catch (error) {
        console.log("\n❌ Error:", error.message);
    }
}

function chat() {
    rl.question("\nYou: ", async (message) => {

        if (message.toLowerCase() === "exit") {
            console.log("\n👋 Chatbot closed.");
            rl.close();
            return;
        }

        await askAI(message);

        chat();
    });
}

console.log("=================================");
console.log("       🤖 AI CHATBOT");
console.log("=================================");
console.log("Type 'exit' to close the chatbot.");

chat();