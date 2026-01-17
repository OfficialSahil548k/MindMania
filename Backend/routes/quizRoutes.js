import express from "express";
import { createQuiz, getQuizzes, getQuiz, updateQuiz } from "../controllers/quizController.js";
// Middleware to check auth would go here eventually
// import auth from "../middleware/auth.js"; 

const router = express.Router();

router.get("/", getQuizzes);
router.get("/:id", getQuiz);
router.post("/", createQuiz); // Should be protected later
router.patch("/:id", updateQuiz);

export default router;
