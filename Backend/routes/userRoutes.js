import express from "express";
import { getUserProfile, updateProfileImage } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.post("/profile-image", auth, (req, res, next) => {
    upload.single("profileImage")(req, res, (err) => {
        if (err) {
            console.error("Multer/Cloudinary Error:", err);
            return res.status(400).json({ message: "Image upload failed", error: err.message });
        }
        next();
    });
}, updateProfileImage);

export default router;
