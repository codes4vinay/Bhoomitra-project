import express from "express";
import { connect, Schema, model as _model } from "mongoose";
import twilio from "twilio";
import Razorpay from "razorpay";
import { config } from "dotenv";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

config();

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

// ✅ Robust CORS Handling
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true
}));

// Handle OPTIONS preflight requests globally
app.options("*", cors());

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// MongoDB Connection
connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// Crop Schema & Model
const cropSchema = new Schema({
    farmerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
});
const Crop = _model("Crop", cropSchema);

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

// Weather Alert Route
app.post("/send-alert", async (req, res) => {
    const { city, temp, condition } = req.body;
    if (!city || temp === undefined || !condition) {
        return res.status(400).json({ error: "Missing weather data" });
    }
    const message = `⚡ Weather Alert! Current weather in ${city}: ${temp}°C, Condition: ${condition}. Stay safe!`;
    try {
        await client.messages.create({ body: message, from: process.env.TWILIO_PHONE_NUMBER, to: process.env.ALERT_PHONE_NUMBER });
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
        res.status(500).json({ message: "Failed to retrieve crops" });
    }
});

app.post("/api/crops", async (req, res) => {
    try {
        const newCrop = new Crop(req.body);
        const savedCrop = await newCrop.save();
        res.status(201).json(savedCrop);
    } catch (err) {
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
        res.status(500).json({ message: "Failed to delete crop" });
    }
});

// Razorpay API Routes
app.post("/api/create-order", async (req, res) => {
    try {
        const { amount, currency, receipt } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ success: false, error: "Invalid amount" });
        const order = await razorpayInstance.orders.create({
            amount: Math.round(amount * 100),
            currency: currency || "INR",
            receipt: receipt || `receipt_${Date.now()}`,
        });
        res.json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment verification parameters" });
        }
        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");
        if (generatedSignature === razorpay_signature) {
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
