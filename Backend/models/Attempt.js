import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        selectedOption: {
            type: String,
            required: true,
        },
    }],
    score: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
    passed: {
        type: Boolean,
        default: false,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
    },
});

// Enforce single attempt per user per quiz
attemptSchema.index({ quiz: 1, user: 1 }, { unique: true });

export default mongoose.model("Attempt", attemptSchema);
