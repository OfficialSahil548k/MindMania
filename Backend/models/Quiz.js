import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
    ],
    timeLimit: {
        type: Number, // In minutes
        default: 10,
    },
    passingScore: {
        type: Number, // Percentage
        default: 50,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    isLive: {
        type: Boolean,
        default: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Quiz", quizSchema);
