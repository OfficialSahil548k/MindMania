import express from "express";
import {
    createInstitute,
    getAllInstitutes,
    getMyInstitutes,
    updateInstitute,
    deleteInstitute,
} from "../controllers/instituteController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public/Auth shared
router.get("/", getAllInstitutes);

router.post("/", auth, createInstitute);
router.get("/my-institutes", auth, getMyInstitutes);
router.put("/:id", auth, updateInstitute);
router.delete("/:id", auth, deleteInstitute);

export default router;
