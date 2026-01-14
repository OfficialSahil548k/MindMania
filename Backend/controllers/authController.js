import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Fetch user info using the access token
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data from Google');
        }

        const data = await response.json();
        const { name, email, sub: googleId } = data;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.findOne({ googleId });
        }

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                role: "student",
            });
        } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }

        const jwtToken = jwt.sign(
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

        res.status(200).json({ result: user, token: jwtToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Google Login failed" });
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
