import express from "express";
import { createQuiz, getQuizzes } from "../controllers/quizController.js";
// Middleware to check auth would go here eventually
// import auth from "../middleware/auth.js"; 

const router = express.Router();

router.get("/", getQuizzes);
router.post("/", createQuiz); // Should be protected later

export default router;
