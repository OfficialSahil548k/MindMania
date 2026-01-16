import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["MCQ", "True/False"],
        default: "MCQ",
    },
    options: [{
        type: String,
        required: true,
    }],
    correctAnswer: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Question", questionSchema);
