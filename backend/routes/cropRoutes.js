const express = require("express");
const mongoose = require("mongoose");
const Crop = require("./models/Crop"); // Import the Crop model

const router = express.Router();

router.post("/api/crops", async (req, res) => {
    try {
        const newCrop = new Crop(req.body);
        await newCrop.save();
        res.status(201).json({ message: "Crop added successfully!", crop: newCrop });
    } catch (error) {
        console.error("Error saving crop:", error);
        res.status(500).json({ error: "Failed to save crop" });
    }
});

module.exports = router;
