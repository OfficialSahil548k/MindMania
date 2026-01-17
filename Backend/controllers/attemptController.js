import Attempt from "../models/Attempt.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

export const startAttempt = async (req, res) => {
    const { quizId } = req.body;
    const userId = req.userId;

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        // Check for existing attempt
        const existingAttempt = await Attempt.findOne({ quiz: quizId, user: userId });

        if (existingAttempt) {
            if (existingAttempt.status === "completed") {
                return res.status(400).json({ message: "You have already completed this quiz." });
            }
            // If pending, just return it (resuming)
            return res.status(200).json(existingAttempt);
        }

        // Create new pending attempt
        const newAttempt = new Attempt({
            quiz: quizId,
            user: userId,
            status: "pending",
        });

        await newAttempt.save();
        res.status(201).json(newAttempt);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitAttempt = async (req, res) => {
    const { quizId, answers } = req.body;
    const userId = req.userId;

    try {
        // 1. Check if Quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        // 2. Find Pending Attempt
        const attempt = await Attempt.findOne({ quiz: quizId, user: userId });

        // If no attempt exists or it's already completed
        if (!attempt) {
            return res.status(404).json({ message: "No active attempt found. Please start the quiz first." });
        }
        if (attempt.status === "completed") {
            return res.status(400).json({ message: "You have already submitted this quiz." });
        }

        // 3. Fetch Questions to calculate score
        // We fetch the actual questions from DB to compare answers, ensuring integrity.
        // Assuming 'answers' is an array of { questionId, selectedOption }

        let score = 0;
        let totalQuestions = 0;
        const processedAnswers = [];

        for (const answer of answers) {
            const question = await Question.findById(answer.questionId);
            if (question) {
                totalQuestions++;
                const isCorrect = question.correctAnswer === answer.selectedOption;
                if (isCorrect) score++;

                processedAnswers.push({
                    questionId: question._id,
                    selectedOption: answer.selectedOption
                });
            }
        }

        // 4. Calculate Pass/Fail
        // passingScore is in percentage
        const scorePercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
        const passed = scorePercentage >= quiz.passingScore;

        // 5. Update Attempt
        attempt.answers = processedAnswers;
        attempt.score = score;
        attempt.passed = passed;
        attempt.status = "completed";
        attempt.completedAt = new Date().toISOString();

        await attempt.save();

        // 6. Return Result
        // Logic for hiding correct answers if quiz is live is handled on Frontend or separate "Review" endpoint.
        // But the user asked: "Correct Answers only visible at end of the quiz and only if quiz is not live."
        // We can return the score immediately.

        res.status(200).json({
            message: "Quiz submitted successfully",
            result: {
                score,
                totalQuestions,
                passed,
                percentage: scorePercentage
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAttempt = async (req, res) => {
    const { id } = req.params;
    try {
        // Populate Quiz to check 'isLive' status
        const attempt = await Attempt.findById(id)
            .populate('quiz')
            .populate('answers.questionId'); // Populate question details

        if (!attempt) return res.status(404).json({ message: "Attempt not found" });

        // Check visibility role
        const quizLive = attempt.quiz.isLive;
        const showCorrectAnswers = !quizLive; // or if user is admin/instructor (not implemented yet)

        if (!showCorrectAnswers) {
            // Mask correct answers from the populated questions
            attempt.answers.forEach(ans => {
                if (ans.questionId) {
                    ans.questionId.correctAnswer = undefined;
                }
            });
        }

        res.status(200).json(attempt);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserAttempts = async (req, res) => {
    try {
        const attempts = await Attempt.find({ user: req.userId }).populate('quiz', 'title');
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
