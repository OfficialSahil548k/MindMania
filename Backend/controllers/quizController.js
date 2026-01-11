import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
    const quiz = req.body;
    const newQuiz = new Quiz({ ...quiz, createdBy: req.userId });

    try {
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
