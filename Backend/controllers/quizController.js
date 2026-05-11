import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";

const normalizeQuizPayload = (quiz) => {
    const { _id, ...updates } = quiz;

    if (!updates.institute) {
        updates.institute = null;
    }

    return updates;
};

export const createQuiz = async (req, res) => {
    const quiz = normalizeQuizPayload(req.body);
    const newQuiz = new Quiz({
        ...quiz,
        createdBy: req.userId,
        createdAt: new Date().toISOString()
    });

    try {
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getQuizzes = async (req, res) => {
    const { category, owner } = req.query;
    try {
        const isOwnerQuery = owner === "true" || owner === true;
        const query = isOwnerQuery
            ? { createdBy: req.userId }
            : { isPublished: true };

        if (category) {
            query.category = category;
        }

        if (!isOwnerQuery && req.query.institute) {
            query.institute = req.query.institute;
        } else if (!isOwnerQuery) {
            query.institute = null;
        }

        const quizzes = await Quiz.find(query).populate("questions", "text type difficulty"); // Don't populate answers here
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getQuiz = async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await Quiz.findById(id).populate("questions", "-correctAnswer"); // Hide correct answers for quiz taker

        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        res.status(200).json(quiz);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateQuiz = async (req, res) => {
    const { id: _id } = req.params;
    const quizUpdates = normalizeQuizPayload(req.body);

    console.log(`Updating Quiz ${_id} with data:`, quizUpdates);

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No quiz with that id');

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(_id, quizUpdates, { new: true });
        res.json(updatedQuiz);
    } catch (error) {
        console.error("Update Quiz Error:", error);
        res.status(400).json({ message: error.message });
    }
}

export const deleteQuiz = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No quiz with that id');

    await Quiz.findByIdAndDelete(id);

    res.json({ message: 'Quiz deleted successfully' });
}
