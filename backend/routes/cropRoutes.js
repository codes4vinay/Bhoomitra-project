import express from "express";
import Crop from "./models/Crop.js"; // ✅ Ensure correct import

const router = express.Router();

// ✅ Get all crops
router.get("/", async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (error) {
        console.error("Error fetching crops:", error);
        res.status(500).json({ error: "Failed to fetch crops" });
    }
});

// ✅ Add a new crop
router.post("/", async (req, res) => {
    try {
        const { farmerName, contactNumber, cropName, quantity, price, location, description, image } = req.body;

        // ✅ Check if all fields are provided
        if (!farmerName || !contactNumber || !cropName || !quantity || !price || !location || !description || !image) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newCrop = new Crop({ farmerName, contactNumber, cropName, quantity, price, location, description, image });

        const savedCrop = await newCrop.save();
        res.status(201).json({ message: "Crop added successfully!", crop: savedCrop });
    } catch (error) {
        console.error("Error saving crop:", error);
        res.status(500).json({ error: "Failed to save crop" });
    }
});

// ✅ Delete a crop by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedCrop = await Crop.findByIdAndDelete(req.params.id);
        if (!deletedCrop) {
            return res.status(404).json({ error: "Crop not found" });
        }
        res.json({ message: "Crop deleted successfully" });
    } catch (error) {
        console.error("Error deleting crop:", error);
        res.status(500).json({ error: "Failed to delete crop" });
    }
});

export default router; // ✅ Correctly export the router
