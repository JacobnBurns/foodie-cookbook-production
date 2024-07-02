import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });

        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Username or password is incorrect!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userID: user._id });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err });
    }
});

export { router as userRouter };

// Token middleware
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if (err) return res.sendStatus(403);
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
