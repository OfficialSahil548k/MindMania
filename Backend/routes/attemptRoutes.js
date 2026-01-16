import express from "express";
import { submitAttempt, getAttempt, getUserAttempts } from "../controllers/attemptController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, submitAttempt);
router.get("/user", auth, getUserAttempts); // Get all attempts for logged in user
router.get("/:id", auth, getAttempt); // Get specific attempt details

export default router;
