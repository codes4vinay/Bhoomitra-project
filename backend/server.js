import express from "express";
import mongoose from "mongoose";
import twilio from "twilio";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure API key is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in .env file.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ DB Connection Error:", err));

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const alertPhoneNumber = process.env.ALERT_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Crop Schema & Model
const cropSchema = new mongoose.Schema({
    farmerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
});
const Crop = mongoose.model("Crop", cropSchema);

// Welcome Route
app.get("/", (req, res) => {
    res.send("Welcome to the Bhoomitra Server!");
});

// AI Content Generation Route
app.post("/generate", async (req, res) => {
    try {
        const userText = req.body.text;
        console.log("User Input:", userText);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(userText);
        const response = await result.response();

        if (!response || !response.text()) {
            throw new Error("No text returned from Gemini API.");
        }

        const text = response.text();
        console.log("Generated Response:", text);
        res.json({ story: text });
    } catch (error) {
        console.error("❌ Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
});

// Weather Alert Route
app.post("/send-alert", async (req, res) => {
    const { city, temp, condition } = req.body;

    if (!city || temp === undefined || !condition) {
        return res.status(400).json({ error: "Missing weather data" });
    }

    const message = `⚡ Weather Alert! Current weather in ${city}: ${temp}°C, Condition: ${condition}. Stay safe!`;

    try {
        await client.messages.create({
            body: message,
            from: twilioNumber,
            to: alertPhoneNumber,
        });
        console.log("✅ Weather alert sent via SMS:", message);
        res.json({ message: "Weather alert sent successfully!" });
    } catch (error) {
        console.error("❌ Twilio Error:", error);
        res.status(500).json({ error: "Failed to send alert via SMS" });
    }
});

// Crop API Routes
app.get("/api/crops", async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (err) {
        console.error("❌ Error fetching crops:", err);
        res.status(500).json({ message: "Failed to retrieve crops" });
    }
});

app.post("/api/crops", async (req, res) => {
    try {
        const newCrop = new Crop(req.body);
        const savedCrop = await newCrop.save();
        res.status(201).json(savedCrop);
    } catch (err) {
        console.error("❌ Error saving crop:", err);
        res.status(400).json({ message: "Failed to save crop" });
    }
});

app.delete("/api/crops/:id", async (req, res) => {
    try {
        const deletedCrop = await Crop.findByIdAndDelete(req.params.id);
        if (!deletedCrop) {
            return res.status(404).json({ message: "Crop not found" });
        }
        res.json({ message: "Crop deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting crop:", err);
        res.status(500).json({ message: "Failed to delete crop" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
