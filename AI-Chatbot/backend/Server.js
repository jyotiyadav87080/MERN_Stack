const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({
                reply: "Please enter a message."
            });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(data);
            return res.status(500).json({
                reply: "AI API error. Please check your API key."
            });
        }

        const aiReply =
            data.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        res.json({
            reply: aiReply
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            reply: "Server error."
        });
    }
});

app.get("/", (req, res) => {
    res.send("AI Chatbot Backend is running!");
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});