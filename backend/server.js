const express = require("express");
const mongoose = require("mongoose");
const twilio = require("twilio");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);

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

// Weather Alert Route
app.post("/send-alert", async (req, res) => {
    const { city, temp, condition } = req.body;

    if (!city || temp === undefined || !condition) {
        return res.status(400).json({ error: "Missing weather data" });
    }

    const message = `\u26A1 Weather Alert! Current weather in ${city}: ${temp}°C, Condition: ${condition}. Stay safe!`;

    try {
        await client.messages.create({
            body: message,
            from: twilioNumber,
            to: process.env.ALERT_PHONE_NUMBER, // Set receiver's phone number in .env
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
