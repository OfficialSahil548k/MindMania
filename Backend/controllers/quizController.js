import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";

export const createQuiz = async (req, res) => {
    const quiz = req.body;
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
    const { category } = req.query;
    try {
        // If user is admin/instructor, they might want to see all or their own.
        // For public/students, show only published.
        // For now, let's keep it simple: Show all published, or if creator, show theirs.

        let query = { isPublished: true };

        // Simple filter for now
        if (category) {
            query.category = category;
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
    const quiz = req.body;

    console.log(`Updating Quiz ${_id} with data:`, quiz);

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No quiz with that id');

    const { _id: idToRemove, ...quizUpdates } = quiz;

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
