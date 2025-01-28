import mongoose from 'mongoose';

// Schema for storing a single message from the user to ChatGPT, or vice-versa
export const MessageSchema = new mongoose.Schema({
    sub: {type: String, required: true},
    tripUUID: {type: mongoose.Types.UUID, required: true},
    text: {type: String, default: ""},
    sender: {type: String, enum: ["user", "assistant"], required: true},
    timestamp: {type: Date, default: Date.now()},
    destinations: {type: Array<String>}
});

export const messageModel = mongoose.model('Message', MessageSchema);
