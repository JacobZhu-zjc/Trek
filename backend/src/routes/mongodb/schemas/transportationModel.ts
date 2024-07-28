import mongoose from "mongoose";

const transportationSchema = new mongoose.Schema({
    mode: { type: String, required: true, default: "" },
    cost: { type: Number, default: 0 },
});

export const transportationModel = mongoose.model("Transportation", transportationSchema);
