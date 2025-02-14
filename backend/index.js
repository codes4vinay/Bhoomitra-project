const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();  // Ensure this is at the top

const app = express();
const PORT = process.env.PORT || 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Ensure API key is available
if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// CORS Configuration
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Bhoomitra Server!");
});

app.post("/generate", async (req, res) => {
    try {
        const userText = req.body.text;
        console.log("User Text:", userText);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(userText);

        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("No text returned from Gemini API.");
        }

        console.log("Generated Response:", text);
        res.json({ story: text });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
