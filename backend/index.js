import express from "express";
import mongoose from "mongoose";
import twilio from "twilio";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure API keys are available
if (!process.env.GEMINI_API_KEY || !process.env.MONGO_URI) {
    console.error("❌ Missing critical environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(userText);
        const text = result.response.text();
        res.json({ story: text });
    } catch (error) {
        console.error("❌ Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
});

// Crop API Routes
app.get("/api/crops", async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve crops" });
    }
});

app.post("/api/crops", async (req, res) => {
    try {
        const { farmerName, contactNumber, cropName, quantity, price, location, description, image } = req.body;
        if (!farmerName || !contactNumber || !cropName || !quantity || !price || !location || !description || !image) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const newCrop = new Crop({ farmerName, contactNumber, cropName, quantity, price, location, description, image });
        const savedCrop = await newCrop.save();
        res.status(201).json(savedCrop);
    } catch (err) {
        console.error("❌ Failed to save crop:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
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
        res.status(500).json({ message: "Failed to delete crop" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
