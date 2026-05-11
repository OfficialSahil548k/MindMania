import express from "express";
import { createQuiz, deleteQuiz, getQuizzes, getQuiz, updateQuiz } from "../controllers/quizController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const authForOwnerQuery = (req, res, next) => {
    if (req.query.owner === "true" || req.query.owner === true) {
        return auth(req, res, next);
    }

    next();
};

router.get("/", authForOwnerQuery, getQuizzes);
router.get("/:id", getQuiz);
router.post("/", auth, createQuiz);
router.patch("/:id", auth, updateQuiz);
router.delete("/:id", auth, deleteQuiz);

export default router;
