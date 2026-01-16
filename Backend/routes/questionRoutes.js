import express from "express";
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from "../controllers/questionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getQuestions);
router.post("/", auth, createQuestion);
router.patch("/:id", auth, updateQuestion);
router.delete("/:id", auth, deleteQuestion);

export default router;
