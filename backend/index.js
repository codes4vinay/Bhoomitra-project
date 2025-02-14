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
const PORT = process.env.PORT || 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ DB Connection Error:", err));

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
            to: process.env.ALERT_PHONE_NUMBER,
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
        res.status(500).json({ message: err.message });
    }
});

app.post("/api/crops", async (req, res) => {
    try {
        const newCrop = new Crop(req.body);
        const savedCrop = await newCrop.save();
        res.status(201).json(savedCrop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/api/crops/:id", async (req, res) => {
    try {
        await Crop.findByIdAndDelete(req.params.id);
        res.json({ message: "Crop deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Razorpay API Routes
app.post("/api/create-order", async (req, res) => {
    try {
        console.log('Create Order Request:', req.body);

        const { amount, currency, receipt } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid amount"
            });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('Missing Razorpay credentials');
            return res.status(500).json({
                success: false,
                error: "Payment gateway configuration error"
            });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: currency || "INR",
            receipt: receipt || `receipt_${Date.now()}`,
        };

        console.log('Creating Razorpay Order with options:', options);

        const order = await razorpayInstance.orders.create(options);
        console.log('Razorpay Order Created:', order);

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
});

app.post("/api/verify-payment", async (req, res) => {
    try {
        console.log('Verify Payment Request:', req.body);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification parameters"
            });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error('Missing Razorpay secret key');
            return res.status(500).json({
                success: false,
                error: "Payment verification configuration error"
            });
        }

        const isValid = validatePaymentVerification(
            {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                signature: razorpay_signature
            },
            process.env.RAZORPAY_KEY_SECRET
        );

        console.log('Payment Verification Result:', isValid);

        if (isValid) {
            res.json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
