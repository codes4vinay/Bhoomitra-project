import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
    farmerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
});

export default mongoose.model("Crop", cropSchema);
