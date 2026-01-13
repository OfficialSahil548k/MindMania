import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "supersecretkey",
            { expiresIn: "1h" }
        );

        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        req.session.isLoggedIn = true;

        res.status(201).json({ result: user, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET || "supersecretkey",
            { expiresIn: "1h" }
        );

        req.session.user = {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
        };
        req.session.isLoggedIn = true;

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};
