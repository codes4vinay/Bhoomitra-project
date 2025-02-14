const express = require("express");
const twilio = require("twilio");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const accountSid = "AC269240259d9b0e17d9a71e3bfbf61a0f";
const authToken = "b17422d549cdd1f1f5c8612ef63099a1";
const client = new twilio(accountSid, authToken);

app.post("/send-alert", async (req, res) => {
    const { city, temp, condition } = req.body;

    if (!city || temp === undefined || !condition) {
        return res.status(400).json({ error: "Missing weather data" });
    }

    const message = `🌩️ Weather Alert! Current weather in ${city}: ${temp}°C, Condition: ${condition}. Stay safe!`;

    try {
        await client.messages.create({
            body: message,
            from: "+15075541578",
            to: "+918000678269", // Replace with your verified Twilio number
        });

        console.log("Weather alert sent via SMS:", message);
        res.json({ message: "Weather alert sent successfully!" });
    } catch (error) {
        console.error("Twilio Error:", error);
        res.status(500).json({ error: "Failed to send alert via SMS" });
    }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
