import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
    farmerName: String,
    contactNumber: String,
    cropName: String,
    quantity: String,
    price: Number,
    location: String,
    description: String,
    image: String, // Store image URL
});

const Crop = mongoose.model('Crop', cropSchema);