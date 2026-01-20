import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";

export const createQuiz = async (req, res) => {
    const quiz = req.body;
    const newQuiz = new Quiz({
        ...quiz,
        institute: quiz.institute || null, // Ensure institute is set if provided
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

        // Filter by institute
        if (req.query.institute) {
            query.institute = req.query.institute;
        } else {
            // If no institute specified, show only Open Quizzes (institute: null)
            // OR show all? Requirement: "In institue based quiz section student first select the their institute, then all the quizes under that institute will be appear"
            // "The Quizes section we have made before, keep it as it is as Open quiz section."
            // So Open Quiz section should ONLY show quizzes with institute: null.
            // But let's check if we want to enforce this stricter now.
            // Yes, "Open quiz section" implies not institute-linked.
            // But existing quizzes have no institute field (undefined), effectively null in filter?
            // Safest: If institute query param is NOT present, default to { institute: null } for Open Section?
            // Or allow fetching all?
            // Let's implement strict separation logic in Frontend query, here we support filter.
            // If the frontend sends ?institute=... we filter.
            // If the frontend sends ?open=true (or just explicit checks), we filter.
            // Let's defer "Open Section" logic to frontend passing `institute=null` or similar.
            // Actually, for backward compatibility, if no institute param, we might return all or just open.
            // Requirement: "The Quizes section we have made before, keep it as it is as Open quiz section."
            // This suggests the default `getQuizzes` call (without params) used by existing pages should probably return only Open keys.
            // Let's check if we have explicit requirement.
            // "keep it as it is as Open quiz section" -> implies defaults should exclude institute quizzes?
            query.institute = null;
        }

        // Wait, if I force query.institute = null, then the Admin dashboard listing ALL quizzes might break if it doesn't send a param.
        // Let's check `req.query.institute`.
        // If `req.query.institute` is explicit string "null", handle it.
        // If `req.query.institute` is undefined, should we return only open quizzes?
        // Let's look at `getQuizzes` usage. It's used in `Home` and `QuizList`.
        // The user said: "The Quizes section we have made before, keep it as it is as Open quiz section."
        // This implies the default view should NOT show institute quizzes.
        // So DEFAULT constitutes `institute: null`.

        if (req.query.institute) {
            query.institute = req.query.institute;
        } else {
            // Default to open quizzes only
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
