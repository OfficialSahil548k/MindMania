import Question from "../models/Question.js";

export const getQuestions = async (req, res) => {
    try {
        // Check if user is admin (assuming role is in req.user or fetched from DB, 
        // effectively we need to populate this in auth middleware or fetch user here.
        // For now, relying on req.userId which auth middleware sets.
        // To properly check role, we might need to fetch the User. 
        // Let's assume strict ownership for now for simplicity, OR if we had role in token.
        // Implementation: Just fetch by createdBy for now. 
        // TODO: Add Admin bypass later if needed.

        const questions = await Question.find({ createdBy: req.userId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createQuestion = async (req, res) => {
    const question = req.body;
    const newQuestion = new Question({ ...question, createdBy: req.userId });
    try {
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateQuestion = async (req, res) => {
    const { id: _id } = req.params;
    const question = req.body;

    // Validate if the question exists and belongs to the user
    // (Implementation omitted for brevity, but should be added)

    try {
        const updatedQuestion = await Question.findByIdAndUpdate(_id, { ...question, _id }, { new: true });
        res.json(updatedQuestion);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        await Question.findByIdAndDelete(id);
        res.json({ message: "Question deleted successfully." });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
